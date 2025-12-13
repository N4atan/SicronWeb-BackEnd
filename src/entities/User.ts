import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    PrimaryGeneratedColumn,
    Generated,
    AfterLoad
  } from 'typeorm'
  
  import { CryptService } from '../services/CryptService'
  import { randomUUID } from 'crypto'
  
  export enum UserRole {
    USER              = 'user',
    ADMIN             = 'admin',
    ONG_MANAGER       = 'ongManager',
    ONG_EMPLOYER      = 'ongEmployer',
    SUPPLIER_ADMIN    = 'supplierAdmin',
    SUPPLIER_EMPLOYER = 'supplierEmployer',
    PROVIDER_MANAGER  = 'providerManager'
  }
  
  @Entity('usertbl')
  export class User {
    @PrimaryGeneratedColumn()
    public id?: number
  
    @Column({ unique: true, length: 36 })
    @Generated('uuid')
    public uuid!: string
  
    @Column({ length: 127 })
    public username!: string
  
    @Column({ length: 255, unique: true })
    public email!: string
  
    @Column({ length: 255 })
    public password!: string
  
    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    public role!: UserRole
  
    private previous_password!: string
  
    @AfterLoad()
    private loadPreviousPassword(): void
    {
      this.previous_password = this.password
    }
  
    @BeforeInsert()
    @BeforeUpdate()
    private async beforeInsert(): Promise<void>
    {
      if (!this.uuid) this.uuid = randomUUID();

      if (this.password !=== this.previous_password)
        this.password = await CryptService.hash(this.password);
    }
  
    public constructor(partial?: Partial<User>) {
      Object.assign(this, partial)
    }
  }  