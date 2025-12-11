import { BeforeInsert, BeforeUpdate, AfterLoad, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { CryptService } from "../services/CryptService";
import { randomUUID } from "crypto";

export enum UserRole
{
    USER             = 'user',
    ADMIN            = 'admin',
    ONG_MANAGER      = 'ongManager',
    PROVIDER_MANAGER = 'providerManager'
}

@Entity('usertbl')
export class User
{
    @PrimaryGeneratedColumn()
    public id?: number;

    @Column({unique: true, length: 36})
    public uuid!: string;

    @Column({ length: 127 })
    public username!: string;

    @Column({ length: 255, unique: true })
    public email!: string;

    @Column({ length: 255 })
    public password!: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    public role!: UserRole;

    @BeforeInsert()
    @BeforeUpdate()
    private async hashPassword(): Promise<void>
    {
        this.password = await CryptService.hash(this.password);
    }

    @BeforeInsert()
    private generateUUID() { if (!this.uuid) this.uuid = randomUUID(); }

    public constructor(user?: Partial<User>)
    {
        this.uuid = randomUUID();

        if (!user) return;
        Object.assign(this, user);
    }
}
