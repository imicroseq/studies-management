import { env } from "../config";
import {
  EgoStudyGroup,
  EgoGetGroupsResponse,
  EgoGetGroupUsersResponse,
  EgoUser,
  EgoGroup,
  type SongStudy,
} from "../common/types";
import urljoin from "url-join";

import oauthClient from "../components/oauthClient";
const { getWithAuth, postWithAuth, deleteWithAuth } = oauthClient;

const getStudyPrefix = (songId: string) => {
  const config = env.songConfig.find((c) => c.SONG_ID === songId);
  return config?.SONG_PREFIX ?? "";
};

const studyIdToEgoGroup = (songId: string, studyId: string) => {
  const prefix = getStudyPrefix(songId);
  return prefix + studyId;
};

const studyIdToEgoPolicy = (songId: string, studyId: string) => {
  const prefix = getStudyPrefix(songId);
  return prefix + studyId;
};

export const getEgoStudyGroups = async (studies: SongStudy[]) => {
  const studyGroups: EgoStudyGroup[] = [];
  const studyIdsMissingGroups = [];
  for (const { songId, studyId } of studies) {
    const egoGroup = await getEgoStudyGroup(songId, studyId);
    if (!egoGroup) {
      studyIdsMissingGroups.push(studyId);
    } else {
      const studyGroup = {
        name: egoGroup.name,
        studyId,
        songId: songId,
        id: egoGroup.id,
        status: egoGroup.status,
      };
      studyGroups.push(studyGroup);
    }
  }

  return { studyGroups, studyIdsMissingGroups };
};

export const getEgoStudyUsers = async (studyGroups: EgoStudyGroup[]) => {
  const studyUsers: Record<string, string[]> = {};
  for (const { id, studyId } of studyGroups) {
    const users = await getWithAuth<EgoGetGroupUsersResponse>(
      urljoin(env.EGO_URL, "/groups/", id, "/users")
    ).then(({ resultSet }) => resultSet);

    studyUsers[studyId] = users.map((u) => u.email);
  }
  return studyUsers;
};

export const addUsersToGroup = async (groupId: string, userIds: string[]) => {
  const res = await postWithAuth(
    urljoin(env.EGO_URL, "/groups/", groupId, "/users"),
    userIds
  );
  return res.status === 200;
};

export const removeUserFromGroup = async (groupId: string, userId: string) => {
  const res = await deleteWithAuth(
    urljoin(env.EGO_URL, "/groups/", groupId, "/users/", userId)
  );
  return res.status === 200;
};

export async function getEgoUser(email: string): Promise<EgoUser | undefined> {
  const url = urljoin(env.EGO_URL, `/users?query=${email}`);
  return getWithAuth<EgoGetGroupUsersResponse>(url).then(({ resultSet }) =>
    // endpoint does fuzzy search so get user with exactly the same email
    resultSet.find((g) => g.email === email)
  );
}

export const getEgoUserGroups = (userId: string): Promise<EgoGroup[]> => {
  const url = urljoin(env.EGO_URL, `/users/${userId}/groups`);
  return getWithAuth<EgoGetGroupsResponse>(url).then(
    ({ resultSet }) => resultSet
  );
};

export async function getEgoStudyGroup(
  songId: string,
  studyId: string
): Promise<EgoGroup | undefined> {
  const egoGroupName = studyIdToEgoGroup(songId, studyId);
  const url = urljoin(env.EGO_URL, `/groups?query=${egoGroupName}`);
  return getWithAuth<EgoGetGroupsResponse>(url).then(({ resultSet }) =>
    // endpoint does fuzzy search so get group with exactly the same name
    resultSet.find((g) => g.name === egoGroupName)
  );
}

export const getEgoStudyGroupUsers = (groupId: string): Promise<EgoUser[]> => {
  const url = urljoin(env.EGO_URL, `/groups/${groupId}/users`);
  return getWithAuth<EgoGetGroupUsersResponse>(url).then(
    ({ resultSet }) => resultSet
  );
};

// return group id
export const createEgoStudyGroup = async (
  songId: string,
  studyId: string,
  description: string = ""
) => {
  const egoCreateGroupRequest = {
    description: description,
    name: studyIdToEgoGroup(songId, studyId),
    status: "APPROVED",
  };
  const res = await postWithAuth<{ id: string }>(
    urljoin(env.EGO_URL, "/groups"),
    egoCreateGroupRequest
  );

  if (res.status === 200) {
    return res.data.id;
  } else {
    return undefined;
  }
};

export const createEgoStudyPolicy = async (songId: string, studyId: string) => {
  const egoCreatePolicyRequest = {
    name: studyIdToEgoPolicy(songId, studyId),
  };
  const egoCreatePolicyRes = await postWithAuth<{ id: string }>(
    urljoin(env.EGO_URL, "/policies"),
    egoCreatePolicyRequest
  );
  if (egoCreatePolicyRes.status === 200) {
    return egoCreatePolicyRes.data.id;
  } else {
    return undefined;
  }
};

export const addGroupToPolicyWithWriteMask = async (
  groupId: string,
  policyId: string
) => {
  const mask = {
    mask: "WRITE",
  };
  const egoUpdateGroupPermissionRes = await postWithAuth(
    urljoin(env.EGO_URL, `/policies/${policyId}/permission/group/${groupId}`),
    mask
  );
  console.log(egoUpdateGroupPermissionRes);
  return egoUpdateGroupPermissionRes.status === 200;
};
