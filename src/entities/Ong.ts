import { Collection, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";




@Entity('ongs')
export class Ong {
    @PrimaryGeneratedColumn()
    id?:number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'manager_id' })
    manager: User;

    @Column({ unique: true })
    legal_name: string;

    @Column()
    business_name: string;

    @Column({ unique: true })
    cnpj: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    wallet!: number;

    @Column({ length: 10 })
    cep_location: string;

    @Column({ length: 15 })
    phone_number: string;

    @Column({ length: 100 })
    email_contact: string;

    constructor(
        manager: User,
        legal_name: string,
        business_name: string,
        cnpj: string,
        wallet: number,
        cep_location: string,
        phone_number: string,
        email_contact: string
    ) {
        this.manager = manager,
        this.legal_name = legal_name,
        this.business_name = business_name,
        this.cnpj = cnpj,
        this.wallet = wallet,
        this.cep_location = cep_location,
        this.phone_number = phone_number,
        this.email_contact = email_contact
    }
}