import { Request, Response } from "express";

import { NGO, NGOStatus } from "../entities/NGO";
import { NGORepository  } from "../repositories/NGORepository";
import { UserRole       } from "../entities/User";

export class NGOController {
    private static ngoRepository = new NGORepository();

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
            } = req.body;

            if (!name || !trade_name || !cnpj || !area || !description || !local || !phone_number || !contact_email)
                return res.status(400).json({ message: "Campos obrigatórios não foram fornecidos!" });

            const exists = await NGOController.ngoRepository.findByTradeName(trade_name);
            if (exists) return res.status(409).json({ message: "Já existe uma ONG com esse nome fantasia!" });

            const manager_uuid = req.user!.uuid;
            const ngo = new NGO({
                manager_uuid,
                name,
                trade_name,
                area,
                description,
                cnpj,
                wallet: 0,
                local,
                phone_number,
                contact_email
            });

            const created = await NGOController.ngoRepository.createAndSave(ngo);
            return res.status(201).location(`/ngo/${created.uuid}`).send();
    }

    static async query(req: Request, res: Response): Promise<Response> {
            const filters: any = {};
            const { name, trade_name, area, status } = req.query;

            if (name)        filters.name        = String(name);
            if (trade_name)  filters.trade_name  = String(trade_name);
            if (area)        filters.area        = String(area);
            if (status)      filters.status      = String(status).toUpperCase() as NGOStatus;

            const list = await this.ngoRepository.findAll({ where: filters });
            return res.status(200).json({ ngos: list });
    }

    static async update(req: Request, res: Response): Promise<Response> {
	        const ngo = req.ngo!;
            if (ngo.status !== NGOStatus.APPROVED && req.user!.role !== UserRole.ADMIN)
                return res.status(403).json({message: "Permissão negada!"});

            const {
                name,
                trade_name,
                area,
                description,
                local,
                phone_number,
                contact_email,
                status
            } = req.body;

            if (name)          ngo.name          = name;
            if (trade_name)    ngo.trade_name    = trade_name;
            if (area)          ngo.area          = area;
            if (description)   ngo.description   = description;
            if (local)         ngo.local         = local;
            if (phone_number)  ngo.phone_number  = phone_number;
            if (contact_email) ngo.contact_email = contact_email;
            
            if (status && req.user!.role === "admin")
                ngo.status = status;

            await NGOController.ngoRepository['repository'].save(ngo);
            return res.status(204).send();
    }

    static async delete(req: Request, res: Response): Promise<Response> {
            const ngo = req.ngo!; 
            
	        if (ngo.manager_uuid !== req.user!.uuid && req.user!.role !== "admin")
                return res.status(403).json({ message: "Permissão negada!" });

            await NGOController.ngoRepository['repository'].remove(ngo);
            return res.status(204).send();
    }
}