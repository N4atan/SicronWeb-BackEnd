import bcrypt from 'bcryptjs';

import {ENV} from '../config/env';

/**
 * Service for cryptographic operations (Hashing).
 */
export class CryptService
{
    /**
     * Hashes a plain text string using Bcrypt.
     *
     * @param value - The plain text string to hash.
     * @returns Promise<string> - The resulting hash.
     */
    static async hash(value: string): Promise<string>
    {
        const rounds = Number.isNaN(ENV.BCRYPT_SALT_HASHES) ?
            10 :
            ENV.BCRYPT_SALT_HASHES;
        return bcrypt.hash(value, rounds);
    }

    /**
     * Compares a plain text string with a hash.
     *
     * @param value - The plain text string.
     * @param hashed - The hash to compare against.
     * @returns Promise<boolean> - True if matches, false otherwise.
     */
    static async compare(value: string, hashed: string):
        Promise<boolean>
    {
        return bcrypt.compare(value, hashed);
    }
}
