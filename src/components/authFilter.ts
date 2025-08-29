import urljoin from 'url-join';
import { EGO_PUBLIC_KEY_ENDPOINT } from '../common/constants';
import { env } from '../config';
import Auth from '@overture-stack/ego-token-middleware';

const jwtKeyUrl = urljoin(env.EGO_URL, EGO_PUBLIC_KEY_ENDPOINT);
const scopes = [env.SCOPES_WRITE];

export default Auth(jwtKeyUrl)(scopes);
