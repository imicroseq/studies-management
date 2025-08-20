import urljoin from "url-join";
import { env } from "../config";
import { CreateStudyReq, SongStudy } from "../common/types";

import oauthClient from "../components/oauthClient";
import { SongIdNotFound } from "../common/errors";
import type { SongConfigSchema } from "../config/songConfig";
const { get, postWithAuth } = oauthClient;

const getSongIds = () => {
  return env.songConfig.map((config: SongConfigSchema) => config.SONG_ID);
};

const getSongUrl = (songId: string) => {
  const songConfig = env.songConfig.find(
    (config: SongConfigSchema) => config.SONG_ID === songId
  );
  if (!songConfig) {
    throw SongIdNotFound(songId);
  }
  return songConfig.SONG_URL;
};

const getSongStudyUrl = (songId: string, studyId: string) => {
  const songUrl = getSongUrl(songId);
  return urljoin(songUrl, "/studies/", studyId);
};

const getSongAllStudiesUrl = (songId: string) => {
  const songUrl = getSongUrl(songId);

  return urljoin(songUrl, "/studies/all");
};

export const getSongStudyIds = async (songId: string) => {
  const songUrl = getSongAllStudiesUrl(songId);
  const studyIds: string[] = await get(songUrl);
  return studyIds;
};

export const getSongStudy = async (
  songId: string,
  studyId: string
): Promise<SongStudy> => {
  const songUrl = getSongStudyUrl(songId, studyId);
  const studyDetail: SongStudy = await get(songUrl);
  return { ...studyDetail, songId };
};

export const getSongStudies = async (songId?: string): Promise<SongStudy[]> => {
  if (songId) {
    const studyIds = await getSongStudyIds(songId);
    const studyDetails = await Promise.all(
      studyIds.map((studyId) => getSongStudy(songId, studyId))
    );
    return studyDetails;
  } else {
    const songIds = getSongIds();
    const results = await Promise.all(songIds.map((id) => getSongStudies(id)));

    return results.flat();
  }
};

export const createSongStudy = async (req: CreateStudyReq) => {
  const songCreateStudyReq = {
    description: req.description,
    name: req.name,
    organization: req.organization,
    studyId: req.studyId,
  };

  // Note: Song create study URL requires trailing slash
  const songStudyUrl = getSongStudyUrl(req.songId, req.studyId) + "/";

  const songCreateStudyRes = await postWithAuth(
    songStudyUrl,
    songCreateStudyReq
  );
  return songCreateStudyRes.status === 200;
};
