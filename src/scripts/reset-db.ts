import * as dotenv from 'dotenv';
import {DataSource} from 'typeorm';
import logger from '../utils/logger';

import {NGO} from '../entities/NGO';
import {NGOProduct} from '../entities/NGOProduct';
import {Product} from '../entities/Product';
import {Supplier} from '../entities/Supplier';
import {SupplierPaymentReceipt} from '../entities/SupplierPaymentReceipt';
import {SupplierProduct} from '../entities/SupplierProduct';
import {User} from '../entities/User';
import {UserDonationReceipt} from '../entities/UserDonationReceipt';

dotenv.config();

const {DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME} =
    process.env;

async function resetDatabase()
{
    try {
        logger.info(
            'Conectando ao banco de dados (MODO RESET - SYNC FALSE)...');

        // Cria uma conexão específica para o reset, SEM SYNCHRONIZE
        // Isso evita que o TypeORM tente alterar tabelas quebradas ao
        // conectar
        const ResetDataSource = new DataSource({
            type: 'mysql',
            host: DB_HOST,
            port: Number(DB_PORT || '3306'),
            username: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB_NAME,
            synchronize: false,  // IMPORTANTE: False para não tentar
                                 // migrar agora
            logging: false,
            entities: [
                User,
                NGO,
                Supplier,
                SupplierPaymentReceipt,
                SupplierProduct,
                Product,
                NGOProduct,
                UserDonationReceipt
            ]
        });

        await ResetDataSource.initialize();
        const queryRunner = ResetDataSource.createQueryRunner();
        await queryRunner.connect();

        logger.info('Desabilitando Foreign Keys...');
        await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');

        const tables = [
            'user_ngo_employments',
            'user_supplier_employments',
            'ngo_products',
            'supplier_products',
            'supplier_payment_receipts',
            'user_donation_receipts',
            'ngotbl',
            'suppliers',
            'products',
            'usertbl'
        ];

        logger.info(`Dropando ${tables.length} tabelas conhecidas...`);

        for (const tableName of tables) {
            logger.info(`Dropando tabela: ${tableName}`);
            await queryRunner.query(
                `DROP TABLE IF EXISTS \`${tableName}\``);
        }

        logger.info('Habilitando Foreign Keys...');
        await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');

        logger.info('Sincronizando entidades (recriando tabelas)...');
        // Agora que está limpo, podemos rodar synchronize
        await ResetDataSource.synchronize();

        await queryRunner.release();
        await ResetDataSource.destroy();

        logger.info('Banco de dados resetado com sucesso!');
        process.exit(0);

    } catch (e) {
        logger.error('Erro ao resetar o banco de dados:', e);
        process.exit(1);
    }
}

resetDatabase();
