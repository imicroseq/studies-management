import 'dotenv/config';

import { z as zod } from 'zod';

export const baseConfig = zod.object({
  EGO_URL: zod.url(),
  SCOPES_WRITE: zod.string(),
  SERVER_PORT: zod.coerce.number().default(3001),
  OAUTH_CLIENT_ID: zod.string(),
  OAUTH_CLIENT_SECRET: zod.string(),
});
