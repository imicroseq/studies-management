import { z as zod } from 'zod';

// Define the number of songs based on the environment variables present
const getSongConfigCount = (): number => {
  let count = 0;
  while (process.env[`SONG_${count}_URL`]) {
    count++;
  }
  return count;
};

const songConfigSchema = zod.object({
  SONG_URL: zod.url(),
  SONG_SAMPLE_TYPE: zod.string(),
  SONG_PREFIX: zod.string(),
});

export type SongConfigSchema = zod.infer<typeof songConfigSchema>;

export const validateSongConfig = (
  env: NodeJS.ProcessEnv
): SongConfigSchema[] => {
  const resultSongConfiguration: SongConfigSchema[] = [];

  const songCount = getSongConfigCount();

  // Loop through the repositories found
  for (let i = 0; i < songCount; i++) {
    // Collect the environment variables for the repository
    const baseKeyPrefix = `SONG_${i}`;

    const songConfig = {
      SONG_URL: env[`${baseKeyPrefix}_URL`],
      SONG_SAMPLE_TYPE: env[`${baseKeyPrefix}_SAMPLE_TYPE`],
      SONG_PREFIX: env[`${baseKeyPrefix}_PREFIX`],
    };

    try {
      const parsed = songConfigSchema.parse(songConfig);
      resultSongConfiguration.push(parsed);
    } catch (error) {
      if (error instanceof zod.ZodError) {
        error.issues.forEach((issue) => {
          console.error(
            `Validation failed for repository ${baseKeyPrefix}`,
            issue
          );
        });
      }
      throw new Error(
        'There is an error with the server environment variables.'
      );
    }
  }

  return resultSongConfiguration;
};
