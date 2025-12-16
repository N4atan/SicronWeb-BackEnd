import { Request, Response } from 'express'

import { Supplier } from '../entities/Supplier'
import { UserRole } from '../entities/User'
import { ApprovalStatus } from "../entities/ApprovalStatus";

import { SupplierRepository } from '../repositories/SupplierRepository'
import { UserRepository } from '../repositories/UserRepository'

export class SupplierController
{
  private static supplierRepository = new SupplierRepository()
  private static userRepository     = new UserRepository()

  static async register(req: Request, res: Response): Promise<Response>
  {
    if (!req.user)
      return res.status(401).json({ message: 'Não autenticado' })

    const {
      companyName,
      tradeName,
      cnpj,
      contactEmail,
      phone,
      address,
      city,
      state,
      postalCode,
      stateRegistration,
      municipalRegistration
    } = req.body

    if (!companyName || !tradeName || !cnpj || !contactEmail)
      return res.status(400).json({ message: 'Campos obrigatórios não fornecidos' })

    const exists = await this.supplierRepository.findByCNPJ(cnpj)
    if (exists)
      return res.status(409).json({ message: 'Fornecedor já cadastrado' })

    req.user.role = UserRole.SUPPLIER_MANAGER;
    await this.userRepository.save(req.user)

    const supplier = new Supplier({
      manager: req.user,
      companyName,
      tradeName,
      cnpj,
      contactEmail,
      phone,
      address,
      city,
      state,
      postalCode,
      stateRegistration,
      municipalRegistration
    })

    const created = await this.supplierRepository.createAndSave(supplier)
    return res.status(201).location(`/supplier/${created.uuid}`).send()
  }

  static async query(req: Request, res: Response): Promise<Response>
  {
    const filters: any = {}
    const { companyName, tradeName, cnpj } = req.query

    if (companyName) filters.companyName = String(companyName)
    if (tradeName)   filters.tradeName   = String(tradeName)
    if (cnpj)        filters.cnpj        = String(cnpj)
    if (status)      filters.status      = String(status).toUpperCase() as ApprovalStatus

    const list = await this.supplierRepository.findAll({ where: filters })
    return res.status(200).json({ suppliers: list })
  }

  static async addEmployee(req: Request, res: Response): Promise<Response>
  {
    const supplier = req.supplier!;

    const { user_uuid } = req.body
    if (!user_uuid)
      return res.status(400).json({ message: 'user_uuid obrigatório' })

    const user = await this.userRepository.findByUUID(user_uuid)
    if (!user)
      return res.status(404).json({ message: 'Usuário não encontrado' })

    user.role = UserRole.SUPPLIER_EMPLOYER
    if (!supplier.employees)
      supplier.employees = []
    if (!user.employedSuppliers)
      user.employedSuppliers = []

    supplier.employees.push(user)
    user.employedSuppliers.push(supplier)

    await this.supplierRepository.save(supplier)
    return res.status(204).send()
  }

  static async update(req: Request, res: Response): Promise<Response>
  {
    const supplier = req.supplier!
    
    if (
      supplier.status !== ApprovalStatus.APPROVED &&
      req.user!.role !== UserRole.ADMIN &&
      supplier.manager.uuid !== req.user!.uuid
    )
      return res.status(403).json({ message: 'Permissão negada' })

    const {
      companyName,
      tradeName,
      contactEmail,
      phone,
      address,
      city,
      state,
      postalCode,
      status,
      manager_uuid
    } = req.body

    if (companyName)  supplier.companyName  = companyName
    if (tradeName)    supplier.tradeName    = tradeName
    if (contactEmail) supplier.contactEmail = contactEmail
    if (phone)        supplier.phone        = phone
    if (address)      supplier.address      = address
    if (city)         supplier.city         = city
    if (state)        supplier.state        = state
    if (postalCode)   supplier.postalCode   = postalCode

    if (manager_uuid && req.user!.role === UserRole.ADMIN)
    {
      const newManager = await this.userRepository.findByUUID(manager_uuid)
      if (!newManager)
        return res.status(404).json({ message: 'Novo gerenciador não encontrado' })

      newManager.role = UserRole.SUPPLIER_MANAGER
      await this.userRepository.save(newManager)

      supplier.manager = newManager
    }

    if (status && req.user!.role === UserRole.ADMIN) supplier.status = status.toUpperCase() as ApprovalStatus;

    await this.supplierRepository.save(supplier)
    return res.status(204).send()
  }

  static async delete(req: Request, res: Response): Promise<Response>
  {
    await this.supplierRepository.remove(req.supplier!.uuid)
    return res.status(204).send()
  }
}
