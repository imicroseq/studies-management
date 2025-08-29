import urljoin from 'url-join';
import { EGO_OAUTH_ENDPOINT } from '../common/constants';
import { env } from '../config';
import fetch from 'node-fetch';

type EgoTokenObj = {
  jwt: string;
  isExpired: () => boolean;
};

let tokenObj: EgoTokenObj;

let refreshingPromise: Promise<EgoTokenObj> | undefined;

const expiredChecker = (expiresAtEpochMs: number) => {
  return () => Date.now() >= expiresAtEpochMs;
};

async function requestNewToken() {
  const endpointQuery = `${EGO_OAUTH_ENDPOINT}?client_id=${env.OAUTH_CLIENT_ID}&client_secret=${env.OAUTH_CLIENT_SECRET}&grant_type=client_credentials`;
  const tokenInfo = await fetch(urljoin(env.EGO_URL, endpointQuery), {
    method: 'POST',
  }).then((res) => res.json());

  return {
    jwt: tokenInfo.access_token,
    isExpired: expiredChecker(Date.now() + tokenInfo.expires_in * 1000),
  };
}

async function getJwt() {
  if (tokenObj && !tokenObj.isExpired()) {
    return tokenObj.jwt;
  }

  if (!refreshingPromise) {
    console.debug('Current token is no good, requesting new one!');
    refreshingPromise = requestNewToken()
      .then((newToken) => {
        tokenObj = newToken;
        refreshingPromise = undefined; // clear after refresh
        return newToken;
      })
      .catch((err) => {
        refreshingPromise = undefined; // clear on failure too
        throw err;
      });
  }

  const fresh = await refreshingPromise;
  return fresh.jwt;
}

async function getAuthHeader() {
  const jwt = await getJwt();
  return { Authorization: `Bearer ${jwt}` };
}

async function get<ExpectedDataType>(url: string): Promise<ExpectedDataType> {
  console.log(`Fetch ${url}`);
  return await fetch(url).then((res) => res.json());
}

async function getWithAuth<ExpectedDataType>(
  url: string
): Promise<ExpectedDataType> {
  const headers = await getAuthHeader();
  console.log(`Fetch with auth ${url}`);
  return await fetch(url, { method: 'GET', headers }).then((res) => res.json());
}

async function postWithAuth<ExpectedDataType>(
  url: string,
  body: object | undefined = undefined
): Promise<{ status: number; data: ExpectedDataType }> {
  const authHeaders = await getAuthHeader();
  return await fetch(url, {
    method: 'POST',
    headers: {
      ...authHeaders,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (res) => {
    if (!res.ok) {
      console.error(`[FetchError] Request failed`, {
        url,
        status: res.status,
        statusText: res.statusText,
      });
      return { status: res.status, data: {} };
    }
    return { status: res.status, data: await res.json() };
  });
}

async function deleteWithAuth(url: string) {
  const headers = await getAuthHeader();
  return await fetch(url, { method: 'DELETE', headers });
}

export default { get, getWithAuth, postWithAuth, deleteWithAuth };
