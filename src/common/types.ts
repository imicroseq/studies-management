export type Study = {
  description: string;
  name: string;
  organization: string;
  songId: string;
  studyId: string;
  submitters: string[];
};

export type EgoStudyGroup = {
  id: string;
  name: string;
  songId: string;
  status: string;
  studyId: string;
};

export type SongStudy = {
  name: string;
  studyId: string;
  organization: string;
  description: string;
  songId: string;
};

export type EgoUser = {
  id: string;
  name: string;
  email: string;
  status: string;
};

export type EgoGroup = {
  name: string;
  description: string;
  id: string;
  status: string;
};

export type EgoGetGroupsResponse = EgoGetResponse<EgoGroup>;

export type EgoGetGroupUsersResponse = EgoGetResponse<EgoUser>;

export type EgoGetResponse<T> = {
  resultSet: T[];
};

export type CreateStudyReq = {
  description: string;
  name: string;
  organization: string;
  songId: string;
  studyId: string;
};

export type AddSubmittersReq = {
  songId: string;
  studyId: string;
  submitters: string[];
};

export type RemoveSubmitterReq = {
  songId: string;
  studyId: string;
  submitter: string;
};

export enum ServiceErrorType {
  STUDY_NOT_FOUND = "STUDY_NOT_FOUND",
  SUBMITTERS_NOT_FOUND = "SUBMITTERS_NOT_FOUND",
  STUDY_ALREADY_EXISTS = "STUDY_ALREADY_EXISTS",
  SONG_ID_NOT_FOUND = "SONG_ID_NOT_FOUND",
  SUBMITTERS_ALREADY_IN_STUDY = "SUBMITTERS_ALREADY_IN_STUDY",
  SUBMITTER_NOT_IN_STUDY = "SUBMITTER_NOT_IN_STUDY",
  FAILED_TO_CREATE_STUDY = "FAILED_TO_CREATE_STUDY",
  FAILED_TO_REMOVE_SUBMITTER_FROM_STUDY = "FAILED_TO_REMOVE_SUBMITTER_FROM_STUDY",
  FAILED_TO_ADD_SUBMITTERS_TO_STUDY = "FAILED_TO_ADD_SUBMITTERS_TO_STUDY",
}

export enum GeneralErrorType {
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  UNKNOWN = "UNKNOWN",
}
