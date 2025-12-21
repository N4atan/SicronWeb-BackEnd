import crypto from 'crypto';

// Generate secure random secrets for development
const generateSecureSecret = (length: number = 64): string => {
    return crypto.randomBytes(length).toString('hex');
};

// Set environment variables with secure defaults
process.env.PORT = '3000';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '3306';
process.env.DB_USERNAME = 'root';
process.env.DB_PASSWORD = 'root'; // TODO: Replace with secure password management
process.env.DB_NAME = 'defaultdb';

// Generate secure JWT secrets instead of using hardcoded 'secret'
process.env.JWT_ACCESS_SECRET = generateSecureSecret();
process.env.JWT_REFRESH_SECRET = generateSecureSecret();
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.BCRYPT_SALT_HASHES = '10';

import 'reflect-metadata';
import {DataSource} from 'typeorm';
import logger from '../utils/logger';

import {User} from '../entities/User';
import {NGO} from '../entities/NGO';
import {Supplier} from '../entities/Supplier';
import {SupplierProduct} from '../entities/SupplierProduct';
import {SupplierPaymentReceipt} from '../entities/SupplierPaymentReceipt';
import {UserDonationReceipt} from '../entities/UserDonationReceipt';
import {Product} from '../entities/Product';
import {NGOProduct} from '../entities/NGOProduct';

async function verify()
{
    const TestDataSource = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'root',
        database: 'defaultdb',
        synchronize: false,
        logging: false,
        entities: [
            User,
            NGO,
            Supplier,
            SupplierPaymentReceipt,
            SupplierProduct,
            Product,
            NGOProduct,
            UserDonationReceipt,
        ],
    });

    try {
        await TestDataSource.initialize();
        logger.info('Connection initialized');
    } catch (error: unknown) {
        logger.error('Connection Failed:', (error as Error).message);
        process.exit(1);
    }

    try {
        const meta = TestDataSource.entityMetadatas;
        logger.info(`Loaded ${meta.length} entities.`);

        if (meta.length === 0) {
            logger.error('Zero entities loaded! Check entity paths.');
            process.exit(1);
        }

        meta.forEach(
            (m) => logger.info(` - Verified Entity: ${
                m.name} -> Table: ${m.tableName}`));

        logger.info(
            'Verification Successful (Metadata & Connection Valid)!');
        process.exit(0);
    } catch (error) {
        logger.error('Metadata Verification Failed: ', error);
        process.exit(1);
    }
}

verify();
