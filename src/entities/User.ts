import { BeforeInsert, BeforeUpdate, AfterLoad, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcryptjs';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    ONG_MANAGER = 'ongManager',
    PROVIDER_MANAGER = 'providerManager'
}


@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ length: 100 })
    username!: string;

    @Column({ length: 100, unique: true })
    email!: string;

    @Column({ length: 255 })
    password!: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role!: UserRole;

    // Para implementar a funcionalidade de "esqueci minha senha"
    private previous_password!: string;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password !== this.previous_password) {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        }
    }

    @AfterLoad()
    loadPreviousPassword() {
        this.previous_password = this.password;
    }


    constructor(user?: Partial<User>) {
        if (user) {
            Object.assign(this, user);
        }
    }
}