import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from "typeorm";
import { randomUUID } from "crypto";

export enum NGOStatus 
{
    PENDING  = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

@Entity('ngotbl')
export class NGO
{
    @PrimaryGeneratedColumn()
    public id?:number;

    @Column({unique: true, length: 36})
    public uuid!: string;

    @Column()
    public manager_uuid: string;

    @Column({ unique: true })
    public name: string;
    
    @Column({ unique: true })
    public cnpj: string;

    @Column({ unique: true})
    public trade_name: string;

    @Column()
    public area: string;
    
    @Column()
    public description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    public wallet!: number;

    @Column({ length: 100 })
    public local: string;

    @Column({ length: 15 })
    public phone_number: string;

    @Column({ length: 100 })
    public contact_email: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    public creation_date?: Date;

    @Column({ type: 'enum', enum: NGOStatus, default: NGOStatus.PENDING})
    public status!: NGOStatus;
    
    @BeforeInsert()
    private generateUUID(): void { if (!this.uuid) this.uuid = randomUUID(); }

    public constructor(
	manager_uuid: string, name:   string, trade_name: string, area:         string, description:   string,
	cnpj:         string, wallet: number, local:      string, phone_number: string, contact_email: string
    ) {
    this.manager_uuid  = manager_uuid;
    this.uuid          = randomUUID();
	this.name          = name;
	this.trade_name    = trade_name;
	this.area          = area;
	this.description   = description;
	this.cnpj          = cnpj;
	this.wallet        = wallet;
	this.local         = local;
	this.phone_number  = phone_number;
	this.contact_email = contact_email;
    }
}
