import { Request, Response } from "express";

import { NGORepository } from "../repositories/NGORepository";

import { NGO, NGOStatus } from "../entities/NGO";

export class NGOController {
    private static ngoRepository = new NGORepository();

    static async register(req: Request, res: Response): Promise<Response> {
        try {
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

            const manager_uuid = req.body.user.uuid;
            const ngo = new NGO(
                manager_uuid,
                name,
                trade_name,
                area,
                description,
                cnpj,
                0,
                local,
                phone_number,
                contact_email
            );

            const created = await NGOController.ngoRepository.createAndSave(ngo);
            return res.status(201).location(`/ngo/${created.uuid}`).json({ uuid: created.uuid });
        } catch (e) {
            console.error(`\n\n---> ERROR: ${e}`);
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
    }

    static async query(req: Request, res: Response): Promise<Response> {
        try {
            const filters: any = {};
            const { name, trade_name, area, status } = req.query;

            if (name)        filters.name        = String(name);
            if (trade_name)  filters.trade_name  = String(trade_name);
            if (area)        filters.area        = String(area);
            if (status)      filters.status      = String(status).toUpperCase() as NGOStatus;

            const list = await (await NGOController.ngoRepository['repository']).find({ where: filters });
            return res.status(200).json({ ngos: list });
        } catch (e) {
            console.error(`\n\n---> ERROR: ${e}`);
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
    }

    static async update(req: Request, res: Response): Promise<Response> {
        try {
            const { uuid } = req.params;
            const target = await NGOController.ngoRepository['repository'].findOneBy({ uuid });

            if (!target) return res.status(404).json({ message: "ONG não encontrada!" });
            if (target.manager_uuid !== req.body.user.uuid)
                return res.status(403).json({ message: "Permissão negada!" });

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

            if (name)          target.name          = name;
            if (trade_name)    target.trade_name    = trade_name;
            if (area)          target.area          = area;
            if (description)   target.description   = description;
            if (local)         target.local         = local;
            if (phone_number)  target.phone_number  = phone_number;
            if (contact_email) target.contact_email = contact_email;
            if (status && req.body.user.role === "admin")
                target.status = status;

            await NGOController.ngoRepository['repository'].save(target);
            return res.status(204).send();
        } catch (e) {
            console.error(`\n\n---> ERROR: ${e}`);
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
    }

    static async delete(req: Request, res: Response): Promise<Response> {
        try {
            const { uuid } = req.params;
            const target = await NGOController.ngoRepository['repository'].findOneBy({ uuid });

            if (!target) return res.status(404).json({ message: "ONG não encontrada!" });
            if (target.manager_uuid !== req.body.user.uuid && req.body.user.role !== "admin")
                return res.status(403).json({ message: "Permissão negada!" });

            await NGOController.ngoRepository['repository'].remove(target);
            return res.status(204).send();
        } catch (e) {
            console.error(`\n\n---> ERROR: ${e}`);
            return res.status(500).json({ message: "Erro interno do servidor." });
        }
    }
}
