import { Request, Response } from "express";

import { User } from "../entities/User";

import { UserRepository } from "../repositories/UserRepository";
import { TokenService   } from "../services/TokenService";
import { RefreshService } from "../services/RefreshService";
import { CryptService   } from "../services/CryptService";

export class UserController {
    private static userRepository = new UserRepository();

    static async register(req: Request, res: Response): Promise<Response>
    {
        try {
            const { username, email, password } = req.body;
            if (!username || !email || !password)
                return res.status(400).json({ message: "Os campos necessários não foram fornecidos!" });

            if (await UserController.userRepository.findByEmail(email))
                return res.status(409).json({ message: "O E-Mail fornecido já possui registro!" });

            const hashed = await CryptService.hash(password);
            const user = new User({ username, email, password: hashed });

            await UserController.userRepository.createAndSave(user);

            if (!user.id)
                return res.status(500).json("Erro interno desconhecido!");

            const tokens = TokenService.generateTokenPair({
                id: user.id,
                email: user.email
            });

            RefreshService.save(user.id, tokens.refreshToken);

            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.status(201).json();
        } catch (e) {
            console.error(`Erro: ${e}`);
            return res.status(500).json({ message: "Ocorreu um erro interno no servidor." });
        }
    }

    static async login(req: Request, res: Response): Promise<Response>
    {
        try {
            const { email, password } = req.body;
            if (!email || !password)
                return res.status(400).json({ message: "E-Mail ou senha não foram fornecidos!" });

            const user = await UserController.userRepository.findByEmail(email);
            if (!user || !user.id || !(await CryptService.compare(password, user.password)))
                return res.status(404).json({ message: "E-Mail e/ou senha estão incorretos." });

            const tokens = TokenService.generateTokenPair({
                id: user.id,
                email: user.email
            });

            RefreshService.save(user.id, tokens.refreshToken);

            res.cookie("refreshToken", tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.status(204).send();
        } catch (e) {
            console.error(`Erro: ${e}`);
            return res.status(500).json({ message: "Ocorreu um erro interno no servidor." });
        }
    }

    static async refresh(req: Request, res: Response): Promise<Response>
    {
        try {
            const user: User = req.body.user;
            const token      = req.cookies.refreshToken;

            if (!token)
                return res.status(401).json({ message: "Dados faltantes fornecidos ao serviço de autentificação!" });

            const payload: any = TokenService.verifyRefresh(token);
            if (!RefreshService.isValid(payload.id, token) || user.id !== payload.id || !user.id)
                return res.status(403).json({ message: "Dados inválidos fornecidos ao serviço de autentificação!" });

            const newTokens = TokenService.generateTokenPair({
                id: user.id,
                email: user.email
            });

            RefreshService.save(user.id, newTokens.refreshToken);

            res.cookie("refreshToken", newTokens.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.status(204).send();
        } catch (e) {
            console.error(`Erro: ${e}`);
            return res.status(403).json({ message: "Dados de autentificações inválidos ou expirados!" });
        }
    }

    static async logout(req: Request, res: Response): Promise<Response>
    {
        try {
            const token = req.cookies.refreshToken;
            if (token) {
                try {
                    const payload: any = TokenService.verifyRefresh(token);
                    RefreshService.revoke(payload.id);
                } catch {}
            }

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
                sameSite: "strict"
            });

            return res.status(204).send();
        } catch (e) {
            console.error(`Erro: ${e}`);
            return res.status(500).json({ message: "Ocorreu um erro interno no servidor." });
        }
    }

    static async show(req: Request, res: Response): Promise<Response>
    {
        try {
            const { email } = req.params;
            const user      = await UserController.userRepository.findByEmail(email);

            if (!user)
                return res.status(404).json({ message: "O usuário não foi encontrado!" });

            return res.status(200).json({ user });
        } catch (e) {
            console.error(`Erro: ${e}`);
            return res.status(500).json({ message: "Ocorreu um erro interno no servidor." });
        }
    }

    static async list(req: Request, res: Response): Promise<Response>
    {
        try {
            const users = await UserController.userRepository.findAll();
            return res.json({ users });
        } catch (e) {
            console.error(`Erro: ${e}`);
            return res.status(500).json({ message: "Ocorreu um erro interno no servidor." });
        }
    }

    static async delete(req: Request, res: Response): Promise<Response>
    {
        try {
            const user: User = req.body.user;
            const targetUser = await UserController.userRepository.findByEmail(req.params.email ?? null);
            
            if (!targetUser || !targetUser.id)
                return res.status(404).json({ message: "O usuário alvo não foi encontrado!" });
            if (user.role !== "admin" && user.id !== targetUser.id)
                return res.status(403).json({ message: "Permissão negada!" });

            await UserController.userRepository.remove(targetUser);
            RefreshService.revoke(targetUser.id);

            return res.status(204).send();
        } catch (e) {
            console.error(`Erro: ${e}`);
            return res.status(500).json({ message: "Ocorreu um erro interno no servidor." });
        }
    }

    static async update(req: Request, res: Response): Promise<Response> 
    {
        try {
            const user: User = req.body.user;
            const targetUser = await UserController.userRepository.findByEmail(req.params.email ?? null);
            
            if (!targetUser || !targetUser.id)
                return res.status(404).json({ message: "O usuário alvo não foi encontrado!" });

            if (user.role !== "admin" && user.id !== targetUser.id)
                return res.status(403).json({ message: "Permissão negada!" });

            const { newUsername, newEmail, newPassword } = req.body;
            
            if (newUsername) user.username = newUsername;
            if (newPassword) user.password = await CryptService.hash(newPassword);

            if (newEmail && newEmail !== user.email) {
                if (await UserController.userRepository.findByEmail(newEmail))
                    return res.status(409).json({ message: "O E-mail fornecido já está em uso!" });
                user.email = newEmail;
            }

            const updated = await UserController.userRepository.save(user);
            return res.status(200).json({
                user: {
                    email: updated.email,
                    username: updated.username
                }
            });
        } catch (e) {
            console.error(`Erro: ${e}`);
            return res.status(500).json({ message: "Ocorreu um erro interno no servidor." });
        }
    }
}