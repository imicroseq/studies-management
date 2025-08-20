import "dotenv/config";

import { z } from "zod";

export const baseConfig = z.object({
  EGO_URL: z.url(),
  SCOPES_WRITE: z.string(),
  SERVER_PORT: z.coerce.number().default(3001),
  OAUTH_CLIENT_ID: z.string(),
  OAUTH_CLIENT_SECRET: z.string(),
});
