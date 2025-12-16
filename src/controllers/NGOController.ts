import { Request, Response } from 'express'

import { ApprovalStatus } from "../entities/ApprovalStatus";
import { NGO } from '../entities/NGO'
import { User, UserRole } from '../entities/User'

import { NGORepository } from '../repositories/NGORepository'
import { UserRepository } from '../repositories/UserRepository'

export class NGOController
{
  private static ngoRepository  = new NGORepository()
  private static userRepository = new UserRepository()

  static async register(req: Request, res: Response): Promise<Response>
  {
    const {
      name,
      trade_name,
      cnpj,
      area,
      description,
      local,
      phone_number,
      contact_email
    } = req.body

    if (!req.user)
      return res.status(401).json({ message: 'Não autenticado' })

    if (!name || !trade_name || !cnpj || !area || !description || !local || !phone_number || !contact_email)
      return res.status(400).json({ message: 'Campos obrigatórios não foram fornecidos!' })

    const exists = await this.ngoRepository.findByTradeName(trade_name)
    if (exists)
      return res.status(409).json({ message: 'Já existe uma ONG com esse nome fantasia!' })

    req.user.role = UserRole.NGO_MANAGER
    await this.userRepository.save(req.user)

    const ngo = new NGO({
      manager: req.user,
      name,
      trade_name,
      area,
      description,
      cnpj,
      wallet: 0,
      local,
      phone_number,
      contact_email
    })

    const created = await this.ngoRepository.createAndSave(ngo)
    return res.status(201).location(`/ngo/${created.uuid}`).send()
  }

  static async query(req: Request, res: Response): Promise<Response>
  {
    const filters: any = {}
    const { name, trade_name, area, status } = req.query

    if (name)       filters.name       = String(name)
    if (trade_name) filters.trade_name = String(trade_name)
    if (area)       filters.area       = String(area)
    if (status)     filters.status     = String(status).toUpperCase() as ApprovalStatus

    const list = await this.ngoRepository.findAll({ where: filters })
    return res.status(200).json({ ngos: list })
  }

  static async addEmployee(req: Request, res: Response): Promise<Response>
  {
    const ngo = req.ngo
    if (!ngo)
      return res.status(404).json({ message: 'ONG não encontrada' })

    if (req.user!.role !== UserRole.NGO_MANAGER || ngo.manager.uuid !== req.user!.uuid)
      return res.status(403).json({ message: 'Permissão negada' })

    const { user_uuid } = req.body
    if (!user_uuid)
      return res.status(400).json({ message: 'user_uuid obrigatório' })

    const user = await this.userRepository.findByUUID(user_uuid)
    if (!user)
      return res.status(404).json({ message: 'Usuário não encontrado' })

    user.role = UserRole.NGO_EMPLOYER
    user.employedNGOs ? user.employedNGOs.push(ngo) : user.employedNGOs = new Array(ngo);

    await this.userRepository.save(user)
    return res.status(204).send()
  }

  static async update(req: Request, res: Response): Promise<Response>
  {
    const ngo = req.ngo
    if (!ngo)
      return res.status(404).json({ message: 'ONG não encontrada' })

    if (
      ngo.status !== ApprovalStatus.APPROVED &&
      req.user!.role !== UserRole.ADMIN &&
      ngo.manager.uuid !== req.user!.uuid
    )
      return res.status(403).json({ message: 'Permissão negada' })

    const {
      name,
      trade_name,
      area,
      description,
      local,
      phone_number,
      contact_email,
      status,
      manager_uuid
    } = req.body

    if (name)          ngo.name          = name
    if (trade_name)    ngo.trade_name    = trade_name
    if (area)          ngo.area          = area
    if (description)   ngo.description   = description
    if (local)         ngo.local         = local
    if (phone_number)  ngo.phone_number  = phone_number
    if (contact_email) ngo.contact_email = contact_email

    if (manager_uuid && req.user!.role === UserRole.ADMIN) {
      const newManager = await this.userRepository.findByUUID(manager_uuid)
      if (!newManager)
        return res.status(404).json({ message: 'Novo manager não encontrado' })

      newManager.role = UserRole.NGO_MANAGER
      await this.userRepository.save(newManager)

      ngo.manager = newManager
    }

    if (status && req.user!.role === UserRole.ADMIN)
      ngo.status = status.toUpperCase() as ApprovalStatus;

    await this.ngoRepository.save(ngo)
    return res.status(204).send()
  }

  static async delete(req: Request, res: Response): Promise<Response>
  {
    const ngo = req.ngo
    if (!ngo)
      return res.status(404).json({ message: 'ONG não encontrada' })

    if (
      ngo.manager.uuid !== req.user!.uuid &&
      req.user!.role !== UserRole.ADMIN
    )
      return res.status(403).json({ message: 'Forbidden' })

    await this.ngoRepository.remove(ngo)
    return res.status(204).send()
  }
}
