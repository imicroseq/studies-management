import z from 'zod';

// Define the number of songs based on the environment variables present
const getSongConfigCount = (): number => {
  let count = 1;
  while (process.env[`SONG_${count}_URL`]) {
    count++;
  }
  return count - 1;
};

const songConfigSchema = z.object({
  SONG_URL: z.url(),
  SONG_SAMPLE_TYPE: z.string(),
  SONG_PREFIX: z.string(),
});

export type SongConfigSchema = z.infer<typeof songConfigSchema>;

export const validateSongConfig = (
  env: NodeJS.ProcessEnv
): SongConfigSchema[] => {
  const resultSongConfiguration: SongConfigSchema[] = [];

  const songCount = getSongConfigCount();

  // Loop through the repositories found
  for (let i = 1; i <= songCount; i++) {
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
      if (error instanceof z.ZodError) {
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
