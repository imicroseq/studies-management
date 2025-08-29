import { baseConfig } from './baseConfig';
import { validateSongConfig } from './songConfig';

const mainSchemaParsed = baseConfig.safeParse(process.env);

if (!mainSchemaParsed.success) {
  mainSchemaParsed.error.issues.forEach((issue) => {
    console.error(issue);
  });
  throw new Error('There is an error with the server environment variables.');
}

const parsedSongConfig = validateSongConfig(process.env);

export const env = { ...mainSchemaParsed.data, songConfig: parsedSongConfig };
