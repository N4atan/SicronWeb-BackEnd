import { Collection, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum ongStatus
{
    PENDENTE  = 'pendente',
    APROVADA  = 'aprovada',
    REJEITADA = 'rejeitada'
}

@Entity('ongs')
export class Ong
{
    @PrimaryGeneratedColumn()
    public id?:number;

    @Column()
    public gestor_email: string;

    @Column({ unique: true })
    public razao_social: string;
    
    @Column({ unique: true })
    public cnpj: string;

    @Column()
    public nome_fantasia: string;

    @Column()
    public foco_principal: string;
    
    @Column()
    public objetivo: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    public wallet!: number;

    @Column({ length: 100 })
    public local: string;

    @Column({ length: 15 })
    public numero_telefone: string;

    @Column({ length: 100 })
    public email_contato: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    public criadaEm?: Date;

    @Column({ type: 'enum', enum: ongStatus, default: ongStatus.PENDENTE })
    public status!: ongStatus;

    public constructor(
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