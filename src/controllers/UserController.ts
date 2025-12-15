import { Request, Response } from "express";

import { User, UserRole } from "../entities/User";

import { UserRepository } from "../repositories/UserRepository";

import { TokenService } from "../services/TokenService";
import { RefreshService } from "../services/RefreshService";
import { CryptService } from "../services/CryptService";

export class UserController {
    public static userRepo = new UserRepository();

    static async register(req: Request, res: Response): Promise<Response> {
        console.log(`[DEBUG] UserController.register called. Body:`, req.body);
        const { username, email, password, role } = req.body;

        // Regra: Apenas ADMIN pode criar usuários logado.
        // Se um usuário COMUM logado tentar criar conta, bloqueia (regra original).
        // Se um ADMIN tentar criar, deixa passar.
        if ((req.logged || req.user) && req.user?.role !== UserRole.ADMIN)
            return res.status(403).json({ message: "Permissão negada!" });

        if (!username || !email || !password)
            return res.status(400).json({ message: "Os campos necessários não foram fornecidos!" });

        if (await UserController.userRepo.findByEmail(email))
            return res.status(409).json({ message: "O E-Mail fornecido já possui registro!" });

        // Se quem está criando é Admin, aceita a role enviada. Senão, usa default.
        const userRole = (req.user?.role === UserRole.ADMIN && role) ? role : undefined;

        const user = new User({ username, email, password, role: userRole });

        await UserController.userRepo.createAndSave(user);
        console.log(`[DEBUG] User registered successfully: ${user.uuid}`);

        return res.status(201).location(`/users/${user.uuid}`).send();
    }

    static async isLogged(req: Request, res: Response): Promise<Response> {
        // console.log(`[DEBUG] UserController.isLogged called.`); // Commented out to reduce noise
        return (req.logged || req.user) ? res.status(200).send() : res.status(401).send();
    }

    static async login(req: Request, res: Response): Promise<Response> {
        console.log(`[DEBUG] UserController.login called. Body:`, req.body);
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "E-Mail ou senha não foram fornecidos!" });

        const user = await UserController.userRepo.findByEmail(email);

        if (!user || !user.id || !(await CryptService.compare(password, user.password))) {
            console.log(`[DEBUG] Login failed for email: ${email}`);
            return res.status(404).json({ message: "E-Mail e/ou senha estão incorretos." });
        }

        const tokens = TokenService.generateTokenPair({
            id: user.id,
            email: user.email
        });

        RefreshService.save(user.id, tokens.refreshToken, req.ip || "");

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

        console.log(`[DEBUG] Login successful for user: ${user.id} (${user.email})`);
        return res.status(204).send();
    }

    static async refresh(req: Request, res: Response): Promise<Response> {
        const user = req.user!;
        const token = req.cookies.refreshToken;

        const payload: any = TokenService.verifyRefresh(token);
        if (!RefreshService.isValid(payload.id, token, req.ip || "") || user.id !== payload.id || !user.id)
            return res.status(403).json({ message: "Dados inválidos fornecidos ao serviço de autentificação!" });

        const newTokens = TokenService.generateTokenPair({
            id: user.id,
            email: user.email
        });

        RefreshService.revoke(user.id, req.ip || "");
        RefreshService.save(user.id, newTokens.refreshToken, req.ip || "");

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
        console.log(`[DEBUG] UserController.query called. Query:`, req.query);
        const user = req.user!;
        const { uuid, email, name } = req.query;

        const filters: any = {};

        if (uuid) filters.uuid = String(uuid);
        if (email && user?.role !== UserRole.ADMIN) filters.email = String(email);
        if (name) filters.name = String(name);

        const users = await UserController.userRepo.findAll({ where: filters });
        console.log(`[DEBUG] UserController.query found ${users.length} users.`);

        users.forEach(u => {
            if (user?.role !== UserRole.ADMIN && user?.id !== u.id) (u as any).email = undefined;

            (u as any).password = undefined;
            (u as any).id = undefined;
        });

        return res.status(200).json({ users });
    }

    static async delete(req: Request, res: Response): Promise<Response> {
        // const user   = req.user!; // Not strictly needed for logic if middleware handled permission
        const target = req.target!;

        console.log(`[DEBUG] UserController.delete called. Target ID: ${target.id}, Target UUID: ${target.uuid}`);

        await UserController.userRepo.remove(target);
        if (target.id) RefreshService.revoke(target.id);

        console.log(`[DEBUG] User deleted successfully.`);
        return res.status(204).send();
    }

    static async update(req: Request, res: Response): Promise<Response> {
        const target = req.target!;
        console.log(`[DEBUG] UserController.update called. Target ID: ${target.id}, Body:`, req.body);

        const { newUsername, newEmail, newPassword, username, email, password, role } = req.body;

        // Support both old and new payload keys
        const updatedUsername = newUsername || username;
        const updatedEmail = newEmail || email;
        const updatedPassword = newPassword || password;

        if (updatedEmail && updatedEmail !== target.email && await UserController.userRepo.findByEmail(updatedEmail))
            return res.status(409).json({ message: "O E-mail fornecido já está em uso!" });

        if (updatedUsername) target.username = updatedUsername;

        // Role update logic: Only admins can change roles
        if (role && req.user!.role === UserRole.ADMIN) {
            target.role = role;
        }

        if (updatedPassword) {
            target.password = updatedPassword;
            if (target.id) RefreshService.revoke(target.id);
        }

        if (updatedEmail) target.email = updatedEmail;

        const updated = await UserController.userRepo.save(target);
        console.log(`[DEBUG] User updated successfully.`);

        // Note: calling refresh here might be tricky if req/res semantics change, but leaving as is.
        // Assuming refresh logic is self-contained.
        // if (newPassword && updated) return UserController.refresh(req, res); // Careful with recursion/context

        return res.status(204).send();
    }

}
