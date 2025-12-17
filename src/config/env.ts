import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.join(__dirname, '../../.env')});

/**
 * Helper to get environment variable or throw error if missing.
 * @param key - Variable name.
 * @param defaultValue - Optional default value.
 * @returns string - Variable value.
 */
const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
    if (value === undefined) {
        throw new Error(`Environment variable ${key} is missing`);
    }
    return value;
};

/**
 * Centralized Environment Variables.
 */
export const ENV = {
    PORT: parseInt(getEnv('PORT', '3000'), 10),
    DB_HOST: getEnv('DB_HOST'),
    DB_PORT: parseInt(getEnv('DB_PORT', '3306'), 10),
    DB_USERNAME: getEnv('DB_USERNAME'),
    DB_PASSWORD: getEnv('DB_PASSWORD'),
    DB_NAME: getEnv('DB_NAME'),
    JWT_ACCESS_SECRET: getEnv('JWT_ACCESS_SECRET'),
    JWT_REFRESH_SECRET: getEnv('JWT_REFRESH_SECRET'),
    JWT_ACCESS_EXPIRES: getEnv('JWT_ACCESS_EXPIRES', '15m'),
    JWT_REFRESH_EXPIRES: getEnv('JWT_REFRESH_EXPIRES', '7d'),
    REDIS_URL: getEnv('REDIS_URL'),
    BCRYPT_SALT_HASHES:
        parseInt(getEnv('BCRYPT_SALT_HASHES', '10'), 10),
};
