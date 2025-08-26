import urljoin from "url-join";
import { env } from "../config";
import { CreateStudyReq, SongStudy } from "../common/types";

import oauthClient from "../components/oauthClient";
import { SampleTypeNotFound } from "../common/errors";
import type { SongConfigSchema } from "../config/songConfig";
const { get, postWithAuth } = oauthClient;

const getSampleTypesFromConfig = () => {
  return env.songConfig.map(
    (config: SongConfigSchema) => config.SONG_SAMPLE_TYPE
  );
};

const getSongUrlFromConfig = (sampleType: string) => {
  const songConfig = env.songConfig.find(
    (config: SongConfigSchema) => config.SONG_SAMPLE_TYPE === sampleType
  );
  if (!songConfig) {
    throw SampleTypeNotFound(sampleType);
  }
  return songConfig.SONG_URL;
};

const getSongStudyUrl = (sampleType: string, studyId: string) => {
  const songUrl = getSongUrlFromConfig(sampleType);
  return urljoin(songUrl, "/studies/", studyId);
};

const getSongAllStudiesUrl = (sampleType: string) => {
  const songUrl = getSongUrlFromConfig(sampleType);

  return urljoin(songUrl, "/studies/all");
};

export const getSongStudyIds = async (sampleType: string) => {
  const songUrl = getSongAllStudiesUrl(sampleType);
  const studyIds: string[] = await get(songUrl);
  return studyIds;
};

export const getSongStudy = async (
  sampleType: string,
  studyId: string
): Promise<SongStudy> => {
  const songUrl = getSongStudyUrl(sampleType, studyId);
  const studyDetail: SongStudy = await get(songUrl);
  return { ...studyDetail, sampleType };
};

export const getSongStudies = async (
  sampleType?: string
): Promise<SongStudy[]> => {
  if (sampleType) {
    const songStudyIds = await getSongStudyIds(sampleType);
    const studyDetails = await Promise.all(
      songStudyIds.map((studyId) => getSongStudy(sampleType, studyId))
    );
    return studyDetails;
  } else {
    const sampleTypes = getSampleTypesFromConfig();
    const results = await Promise.all(
      sampleTypes.map((type) => getSongStudies(type))
    );

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
  const songStudyUrl = getSongStudyUrl(req.sampleType, req.studyId) + "/";

  const songCreateStudyRes = await postWithAuth(
    songStudyUrl,
    songCreateStudyReq
  );
  return songCreateStudyRes.status === 200;
};
