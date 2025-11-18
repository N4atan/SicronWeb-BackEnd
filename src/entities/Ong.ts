import { Collection, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum ongStatus {
    PENDENTE = 'pendente',
    APROVADA = 'aprovada',
    REJEITADA = 'rejeitada'
}

@Entity('ongs')
export class Ong {
    @PrimaryGeneratedColumn()
    id?:number;

    @Column()
    gestor_email: string;

    @Column({ unique: true })
    razao_social: string;
    
    @Column({ unique: true })
    cnpj: string;

    @Column()
    nome_fantasia: string;

    @Column()
    foco_principal: string;
    
    @Column()
    objetivo: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    wallet!: number;

    @Column({ length: 100 })
    local: string;

    @Column({ length: 15 })
    numero_telefone: string;

    @Column({ length: 100 })
    email_contato: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    criadaEm?: Date;

    @Column({ type: 'enum', enum: ongStatus, default: ongStatus.PENDENTE })
    status!: ongStatus;

    constructor(
        manager_email: string,
        legal_name: string,
        business_name: string,
        foco_principal: string,
        objetivo: string,
        cnpj: string,
        wallet: number,
        local: string,
        phone_number: string,
        email_contact: string
    ) {
        this.gestor_email = manager_email,
        this.razao_social = legal_name,
        this.nome_fantasia = business_name,
        this.foco_principal = foco_principal,
        this.objetivo = objetivo,
        this.cnpj = cnpj,
        this.wallet = wallet,
        this.local = local,
        this.numero_telefone = phone_number,
        this.email_contato = email_contact
    }
}