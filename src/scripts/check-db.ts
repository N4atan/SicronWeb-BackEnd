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

    console.log('Initializing Verification DataSource...');
    try {
        await TestDataSource.initialize();
        console.log('DataSource Initialized Successfully!');
    } catch (error: unknown) {
        console.error('Connection Failed:', (error as Error).message);
        process.exit(1);
    }

    try {
        console.log('Checking Metadata Loading...');
        const meta = TestDataSource.entityMetadatas;
        console.log(`Loaded ${meta.length} entities.`);

        if (meta.length === 0) {
            console.error(
                'Zero entities loaded! Check entity paths.');
            process.exit(1);
        }

        console.log('Database Verification Successful!');
        process.exit(0);
    } catch (error) {
        console.error('Metadata Verification Failed:', error);
        process.exit(1);
    }
}

verify();
