import {Request, Response} from 'express';

import {ApprovalStatus} from '../entities/ApprovalStatus';
import {Supplier} from '../entities/Supplier';
import {UserRole} from '../entities/User';
import {SupplierRepository} from '../repositories/SupplierRepository';
import {UserRepository} from '../repositories/UserRepository';
import {EmploymentService} from '../services/EmploymentService';

/**
 * Controller for managing Supplier operations.
 */
export class SupplierController
{
    private static supplierRepository = new SupplierRepository();
    private static userRepository = new UserRepository();

    /**
     * Registers a new Supplier.
     *
     * @param req - Express Request object containing supplier
     *     details.
     * @param res - Express Response object.
     * @returns Promise<Response> - The created Supplier or error.
     */
    static async register(req: Request, res: Response):
        Promise<Response>
    {
        if (!req.user)
            return res.status(401).json({message: 'Não autenticado'});

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
            municipalRegistration,
        } = req.body;

        if (!companyName || !tradeName || !cnpj || !contactEmail)
            return res.status(400).json(
                {message: 'Campos obrigatórios não fornecidos'});

        const exists = await this.supplierRepository.findByCNPJ(cnpj);
        if (exists)
            return res.status(409).json(
                {message: 'Fornecedor já cadastrado'});

        req.user.role = UserRole.SUPPLIER_MANAGER;
        await this.userRepository.save(req.user);

        const supplier = new Supplier({
            manager: req.user!,
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
            municipalRegistration,
        });

        const created =
            await this.supplierRepository.createAndSave(supplier);
        return res.status(201)
            .location(`/supplier/${created.uuid}`)
            .send();
    }

    /**
     * Queries Suppliers based on filters.
     *
     * @param req - Express Request object with query filters.
     * @param res - Express Response object.
     * @returns Promise<Response> - List of Suppliers matching
     *     criteria.
     */
    static async query(req: Request, res: Response): Promise<Response>
    {
        const filters: Record<string, unknown> = {};
        const {companyName, tradeName, cnpj, status} = req.query;

        if (companyName) filters.companyName = String(companyName);
        if (tradeName) filters.tradeName = String(tradeName);
        if (cnpj) filters.cnpj = String(cnpj);
        if (status)
            filters.status =
                String(status).toUpperCase() as ApprovalStatus;

        const list = (await this.supplierRepository.findAll(
                         {where: filters})) ||
            [];

        const safeList = list.map((supplier) => {
            const safeSupplier = {...supplier};

            // Sanitize internal ID for non-privileged users
            if (req.user?.role !== UserRole.ADMIN &&
                req.user?.uuid !== supplier.manager?.uuid) {
                delete (safeSupplier as Partial<Supplier>).id;
            }

            return safeSupplier;
        });

        return res.status(200).json({suppliers: safeList});
    }

    /**
     * Adds an employee to the Supplier.
     *
     * @param req - Express Request object with user_uuid.
     * @param res - Express Response object.
     * @returns Promise<Response> - 204 No Content or error.
     */
    static async addEmployee(req: Request, res: Response):
        Promise<Response>
    {
        const result = await EmploymentService.hire(
            this.userRepository.repository,
            this.supplierRepository.repository,
            req.supplier!,
            req.body.user_uuid,
            UserRole.SUPPLIER_EMPLOYER,
            'blockedSuppliers',
            'employees',
            'employedSuppliers',
        );
        if (result.status !== 204)
            return res.status(result.status).json({
                message: result.message
            });
        return res.status(204).send();
    }

    /**
     * Removes an employee from the Supplier.
     *
     * @param req - Express Request object with user_uuid.
     * @param res - Express Response object.
     * @returns Promise<Response> - 204 No Content or error.
     */
    static async removeEmployee(req: Request, res: Response):
        Promise<Response>
    {
        const result = await EmploymentService.dismiss(
            this.userRepository.repository,
            this.supplierRepository.repository,
            req.supplier!,
            req.body.user_uuid,
            'employedSuppliers',
            req.user!,
        );
        if (result.status !== 204)
            return res.status(result.status).json({
                message: result.message
            });
        return res.status(204).end();
    }

    /**
     * Blocks an employee/user from the Supplier.
     *
     * @param req - Express Request object.
     * @param res - Express Response object.
     * @returns Promise<Response> - 204 No Content or error.
     */
    static async blockEmployee(req: Request, res: Response):
        Promise<Response>
    {
        const result = await EmploymentService.block(
            this.userRepository.repository,
            this.supplierRepository.repository,
            req.supplier!,
            req.user!,
            'employedSuppliers',
            'blockedSuppliers',
        );
        if (result.status !== 204)
            return res.status(result.status).json({
                message: result.message
            });
        return res.status(204).send();
    }

    /**
     * Updates a Supplier's details.
     *
     * @param req - Express Request object with updates.
     * @param res - Express Response object.
     * @returns Promise<Response> - 204 No Content or error.
     */
    static async update(req: Request, res: Response):
        Promise<Response>
    {
        const supplier = req.supplier!;

        if (supplier.status !== ApprovalStatus.APPROVED &&
            req.user!.role !== UserRole.ADMIN &&
            supplier.manager.uuid !== req.user!.uuid)
            return res.status(403).json(
                {message: 'Permissão negada'});

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
            manager_uuid,
        } = req.body;

        if (companyName) supplier.companyName = companyName;
        if (tradeName) supplier.tradeName = tradeName;
        if (contactEmail) supplier.contactEmail = contactEmail;
        if (phone) supplier.phone = phone;
        if (address) supplier.address = address;
        if (city) supplier.city = city;
        if (state) supplier.state = state;
        if (postalCode) supplier.postalCode = postalCode;

        if (manager_uuid && req.user!.role === UserRole.ADMIN) {
            const newManager =
                await this.userRepository.findByUUID(manager_uuid);
            if (!newManager)
                return res.status(404).json(
                    {message: 'Novo gerente não encontrado'});

            newManager.role = UserRole.SUPPLIER_MANAGER;
            await this.userRepository.save(newManager);
            supplier.manager = newManager;
        }

        if (status && req.user!.role === UserRole.ADMIN)
            supplier.status = status.toUpperCase() as ApprovalStatus;

        await this.supplierRepository.save(supplier);
        return res.status(204).send();
    }

    /**
     * Deletes a Supplier.
     *
     * @param req - Express Request object.
     * @param res - Express Response object.
     * @returns Promise<Response> - 204 No Content or error.
     */
    static async delete(req: Request, res: Response):
        Promise<Response>
    {
        const supplier = req.supplier!;

        if (req.user!.role !== UserRole.ADMIN &&
            supplier.manager.uuid !== req.user!.uuid)
            return res.status(403).json(
                {message: 'Permissão negada'});

        await this.supplierRepository.remove(supplier.uuid);
        return res.status(204).send();
    }
}
