import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Generated,
  AfterLoad,
  OneToOne,
  ManyToMany,
  JoinTable
} from 'typeorm'

import { randomUUID } from 'crypto'
import { CryptService } from '../services/CryptService'

import { NGO } from './NGO'
import { Supplier } from './Supplier'

export enum UserRole {
  USER              = 'user',
  ADMIN             = 'admin',
  
  NGO_OWNER         = 'ngoOwner',         /* On Future */
  NGO_MANAGER       = 'ngoManager',
  NGO_EMPLOYER      = 'ngoEmployer',

  SUPPLIER_OWNER    = 'supplierOwner',    /* On Future */
  SUPPLIER_MANAGER  = 'supplierManager',
  SUPPLIER_EMPLOYER = 'supplierEmployer'
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

  @OneToOne(() => NGO, ngo => ngo.manager)
  public managedNGO?: NGO

  @OneToOne(() => Supplier, supplier => supplier.manager)
  public managedSupplier?: Supplier

  @ManyToMany(() => NGO)
  @JoinTable({
    name: 'user_ngo_employments',
    joinColumn: { name: 'user_uuid', referencedColumnName: 'uuid' },
    inverseJoinColumn: { name: 'ngo_uuid', referencedColumnName: 'uuid' }
  })
  public employedNGOs?: NGO[]

  @ManyToMany(() => Supplier)
  @JoinTable({
    name: 'user_supplier_employments',
    joinColumn: { name: 'user_uuid', referencedColumnName: 'uuid' },
    inverseJoinColumn: { name: 'supplier_uuid', referencedColumnName: 'uuid' }
  })
  public employedSuppliers?: Supplier[]

  private previous_password!: string

  @AfterLoad()
  private loadPreviousPassword(): void {
    this.previous_password = this.password
  }

  @BeforeInsert()
  @BeforeUpdate()
  private async beforeInsert(): Promise<void> {
    if (!this.uuid) this.uuid = randomUUID()
    if (this.password !== this.previous_password)
      this.password = await CryptService.hash(this.password)
  }

  public constructor(partial?: Partial<User>) {
    Object.assign(this, partial)
  }
}
