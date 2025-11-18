import { Collection, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";




@Entity('ongs')
export class Ong {
    @PrimaryGeneratedColumn()
    id?:number;

    @JoinColumn({ name: 'gestor_email' })
    gestor: string;

    @Column({ unique: true })
    razao_social: string;

    @Column()
    nome_fantasia: string;

    @Column({ unique: true })
    cnpj: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    wallet!: number;

    @Column({ length: 10 })
    cep_location: string;

    @Column({ length: 15 })
    numero_telefone: string;

    @Column({ length: 100 })
    email_contato: string;

    constructor(
        manager: string,
        legal_name: string,
        business_name: string,
        cnpj: string,
        wallet: number,
        cep_location: string,
        phone_number: string,
        email_contact: string
    ) {
        this.gestor = manager,
        this.razao_social = legal_name,
        this.nome_fantasia = business_name,
        this.cnpj = cnpj,
        this.wallet = wallet,
        this.cep_location = cep_location,
        this.numero_telefone = phone_number,
        this.email_contato = email_contact
    }
}