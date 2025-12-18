import { Request, Response } from "express";

import { User, UserRole } from "../entities/User";

import { UserRepository } from "../repositories/UserRepository";

import { TokenService } from "../services/TokenService";
import { RefreshService } from "../services/RefreshService";
import { CryptService } from "../services/CryptService";

export class UserController {
    public static userRepo = new UserRepository();

    static async register(req: Request, res: Response): Promise<Response> {
        const { username, email, password, role } = req.body;

        if ((req.logged || req.user) && req.user?.role !== UserRole.ADMIN)
            return res.status(403).json({ message: "Permissão negada!" });

        if (!username || !email || !password)
            return res.status(400).json({ message: "Os campos necessários não foram fornecidos!" });

        if (await UserController.userRepo.findByEmail(email))
            return res.status(409).json({ message: "O E-Mail fornecido já possui registro!" });

        const userRole = (req.user?.role === UserRole.ADMIN && role) ? role : undefined;

        const user = new User({ username, email, password, role: userRole });

        await UserController.userRepo.createAndSave(user);
        return res.status(201).location(`/users/${user.uuid}`).send();
    }

    static async isLogged(req: Request, res: Response): Promise<Response> {
        if (req.logged || req.user) {
            // Recarrega o usuário com as relações para garantir que temos os dados da ONG/Fornecedor
            const userWithRelations = await UserController.userRepo.findOne({
                where: { uuid: req.user!.uuid },
                relations: ['managedNGO', 'managedSupplier']
            }) as any;

            if (userWithRelations) {
                if (userWithRelations.password) userWithRelations.password = undefined;
                if (userWithRelations.previous_password) userWithRelations.previous_password = undefined;
                return res.status(200).json(userWithRelations);
            }
        }
        return res.status(401).send();
    }

    static async login(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "E-Mail ou senha não foram fornecidos!" });

        const user = await UserController.userRepo.findByEmail(email);

        if (!user || !user.id || !(await CryptService.compare(password, user.password))) {
            console.log(`[DEBUG] Login failed for email: ${email}`);
            return res.status(404).json({ message: "E-Mail e/ou senha estão incorretos." });
        }

        const tokens = TokenService.generateTokenPair({
            id: user.uuid,
            email: user.email
        });

        RefreshService.save(user.uuid, tokens.refreshToken, req.ip || "");

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.cookie("accessToken", tokens.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 15 * 1000
        });

        return res.status(204).send();
    }

    static async refresh(req: Request, res: Response): Promise<Response> {
        const user = req.user!;
        const token = req.cookies.refreshToken;

        const payload: any = TokenService.verifyRefresh(token);
        if (!RefreshService.isValid(payload.id, token, req.ip || "") || user.uuid !== payload.id || !user.uuid)
            return res.status(403).json({ message: "Dados inválidos fornecidos ao serviço de autentificação!" });

        const newTokens = TokenService.generateTokenPair({
            id: user.uuid,
            email: user.email
        });

        RefreshService.revoke(user.uuid, req.ip || "");
        RefreshService.save(user.uuid, newTokens.refreshToken, req.ip || "");

        res.cookie("refreshToken", newTokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.cookie("accessToken", newTokens.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 15 * 1000
        });

        return res.status(204).send();

    }

    static async logout(req: Request, res: Response): Promise<Response> {
        const token = req.cookies.refreshToken;

        if (token) {
            try {
                const payload: any = TokenService.verifyRefresh(token);
                RefreshService.revoke(payload.id, req.ip || "");
            } catch { }
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });

        return res.status(204).send();
    }

    static async query(req: Request, res: Response): Promise<Response> {
        const user = req.user!;
        const { uuid, email, name } = req.query;

        const filters: any = {};

        if (uuid) filters.uuid = String(uuid);

        // Email apenas para ADMIN. Outros buscam por Username.
        if (email) {
            if (user.role === UserRole.ADMIN) {
                filters.email = String(email);
            } else {

                return res.status(403).json({ message: "Busca por email permitida apenas para administradores." });
            }
        }
        if (name) filters.name = String(name);

        const users = await UserController.userRepo.findAll({
            where: filters,
            relations: ['managedNGO', 'managedSupplier']
        });
        console.log(`[DEBUG] UserController.query found ${users.length} users.`);

        users.forEach(u => {
            // Se não for admin e estiver vendo outro usuário, esconde o email
            if (user?.role !== UserRole.ADMIN && user?.id !== u.id) (u as any).email = undefined;

            (u as any).password = undefined;
            (u as any).id = undefined;
        });

        return res.status(200).json({ users });
    }

    static async delete(req: Request, res: Response): Promise<Response> {
        const target = req.target!;

        await UserController.userRepo.remove(target);
        RefreshService.revoke(target.uuid);

        return res.status(204).send();
    }

    static async update(req: Request, res: Response): Promise<Response> {
        const target = req.target!;

        const { newUsername, newEmail, newPassword, username, email, password, role } = req.body;

        const updatedUsername = newUsername || username;
        const updatedEmail = newEmail || email;
        const updatedPassword = newPassword || password;

        if (updatedEmail && updatedEmail !== target.email && await UserController.userRepo.findByEmail(updatedEmail))
            return res.status(409).json({ message: "O E-mail fornecido já está em uso!" });

        if (updatedUsername) target.username = updatedUsername;

        if (role && req.user!.role === UserRole.ADMIN) {
            target.role = role;
        }

        if (updatedPassword) {
            target.password = updatedPassword;
            RefreshService.revoke(target.uuid);
        }

        if (updatedEmail) target.email = updatedEmail;

        const updated = await UserController.userRepo.save(target);

        return res.status(204).send();
    }
}
