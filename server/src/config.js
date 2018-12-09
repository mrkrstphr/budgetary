import dotenv from 'dotenv';
import path from 'path';

const configPath = path.resolve(__dirname, '..', '.env');
const config = dotenv.config({ path: configPath });

console.log({ config });
