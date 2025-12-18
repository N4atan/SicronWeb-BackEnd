process.env.PORT = '3000';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '3306';
process.env.DB_USERNAME = 'root';
process.env.DB_PASSWORD = 'root';
process.env.DB_NAME = 'defaultdb';
process.env.JWT_ACCESS_SECRET = 'secret';
process.env.JWT_REFRESH_SECRET = 'secret';
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

    logger.info('Initializing Verification DataSource...');
    try {
        await TestDataSource.initialize();
        logger.info('DataSource Initialized Successfully!');
    } catch (error: unknown) {
        logger.error('Connection Failed:', (error as Error).message);
        process.exit(1);
    }

    try {
        logger.info('Checking Metadata Loading...');
        const meta = TestDataSource.entityMetadatas;
        logger.info(`Loaded ${meta.length} entities.`);

        if (meta.length === 0) {
            logger.error('Zero entities loaded! Check entity paths.');
            process.exit(1);
        }

        logger.info('Database Verification Successful!');
        process.exit(0);
    } catch (error) {
        logger.error('Metadata Verification Failed:', error);
        process.exit(1);
    }
}

verify();
