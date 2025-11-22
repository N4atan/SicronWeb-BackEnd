import bcrypt from "bcryptjs";

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_HASHES || "10", 10);

export class CryptService {
    static async hash(value: string): Promise<string>
    {
        return bcrypt.hash(value, SALT_ROUNDS);
    }

    static async compare(value: string, hashed: string): Promise<boolean>
    {
        return bcrypt.compare(value, hashed);
    }
}