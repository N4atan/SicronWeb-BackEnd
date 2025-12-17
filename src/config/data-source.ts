import 'reflect-metadata';

import {DataSource} from 'typeorm';

import {NGO} from '../entities/NGO';
import {NGOProduct} from '../entities/NGOProduct';
import {Product} from '../entities/Product';
import {Supplier} from '../entities/Supplier';
import {SupplierPaymentReceipt} from '../entities/SupplierPaymentReceipt';
import {SupplierProduct} from '../entities/SupplierProduct';
import {User} from '../entities/User';
import {UserDonationReceipt} from '../entities/UserDonationReceipt';

import {ENV} from './env';

/**
 * TypeORM DataSource configuration.
 * Connects to the MySQL database using environment variables.
 */
export const AppDataSource = new DataSource({
    type: 'mysql',
    host: ENV.DB_HOST,
    port: ENV.DB_PORT,
    username: ENV.DB_USERNAME,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_NAME,
    synchronize: true,
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
