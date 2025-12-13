import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

import { User } from "../entities/User";
import { NGO  } from "../entities/NGO";
import { Supplier } from "../entities/Supplier";
import { SupplierPaymentReceipt } from "../entities/SupplierPaymentReceipt";
import { NGOProduct } from "../entities/NGOProduct";
import { SupplierProduct } from "../entities/SupplierProduct";
import { Product } from "../entities/Product";
import { UserDonationReceipt } from "../entities/UserDonationReceipt";

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

export const AppDataSource = new DataSource({
    type: "mysql",
    host: DB_HOST,
    port: Number(DB_PORT || "3306"),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    synchronize: true,
    logging: true,
    entities: [User, NGO, Supplier, SupplierPaymentReceipt, SupplierProduct, Product, NGOProduct, UserDonationReceipt]
});