import { BeforeInsert, BeforeUpdate, AfterLoad, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { CryptService } from "../services/CryptService";

export enum UserRole
{
    USER             = 'user',
    ADMIN            = 'admin',
    ONG_MANAGER      = 'ongManager',
    PROVIDER_MANAGER = 'providerManager'
}

@Entity('users')
export class User
{
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

    private previous_password!: string;

    @BeforeInsert()
    @BeforeUpdate()
    private async hashPassword(): Promise<void>
    {
        if (this.password === this.previous_password) return;
        this.password = await CryptService.hash(this.password);
    }

    @AfterLoad()
    private loadPreviousPassword(): void
    {
        this.previous_password = this.password;
    }

    public constructor(user?: Partial<User>)
    {
        if (!user) return;
        Object.assign(this, user);
    }
}