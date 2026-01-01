import 'dotenv/config';
import { cleanEnv, num, str } from 'envalid';

export const envs = cleanEnv(process.env, {
  PORT: num(),
  NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
  DB_URI: str(),
});
