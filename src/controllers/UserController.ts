import { Request, Response } from "express";
import { User, UserRole } from "../entities/User";
import { UserRepository } from "../repositories/UserRepository";
import { TokenService } from "../services/TokenService";
import { RefreshService } from "../services/RefreshService";
import { CryptService } from "../services/CryptService";

export class UserController {
    private static userRepository = new UserRepository();

    static async register(req: Request, res: Response): Promise<Response>
    {
        try {
            const { username, email, password } = req.body;
        
            if (req.body.logged || req.body.user)
                return res.status(403).json({ message: "Permissão negada!" });
            if (!username || !email || !password)
                return res.status(400).json({ message: "Os campos necessários não foram fornecidos!" });

            if (await UserController.userRepository.findByEmail(email))
                return res.status(409).json({ message: "O E-Mail fornecido já possui registro!" });

            const hashed = await CryptService.hash(password);
            const user = new User({ username, email, password: hashed });

            await UserController.userRepository.createAndSave(user);
            if (!user.id) return res.status(500).json("Erro interno desconhecido!");

            (user as any).password = (user as any).id = undefined;
            return res.status(201).location(`/users/${user.uuid}`).json(user);
        } catch (e) {
            console.error(`\n\n---> ERROR: ${e}`);
            return res.status(500).json({ message: "Ocorreu um erro interno no servidor." });
        }
    }

    static async isLogged(req: Request, res: Response): Promise<Response>
    {
        return (req.body.logged || req.body.user) ? res.status(200).send() : res.status(401).send();
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

            return res.status(204).send();
        } catch (e) {
            console.error(`\n\n---> ERROR: ${e}`);
            return res.status(500).json({ message: "Ocorreu um erro interno no servidor." });
        }
    }

    static async refresh(req: Request, res: Response): Promise<Response>
    {
        try {
            const user: User    = req.body.user;
            const token: string = req.cookies.refreshToken;

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
        } catch (e) {
            console.error(`\n\n---> ERROR: ${e}`);
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
                    RefreshService.revoke(payload.id, req.ip || "");
                } catch {}
            }

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
                sameSite: "strict"
            });

            return res.status(204).send();
        } catch (e) {
            console.error(`\n\n---> ERROR: ${e}`);
            return res.status(500).json({ message: "Ocorreu um erro interno no servidor." });
        }
    }

    static async query(req: Request, res: Response): Promise<Response>
    {
        try {
            const user  = req.body.user;
            const { uuid, email, name } = req.query;
            
            const filters: any = {};

            if (uuid)                               filters.uuid  = String(uuid);
            if (email && user?.role !== UserRole.ADMIN) filters.email = String(email);
            if (name)                               filters.name  = String(name);

            const users = await UserController.userRepository.findAll({ where: filters });

            users.forEach(u => {
                if (user?.role !== UserRole.ADMIN && user?.id !== u.id) (u as any).email = undefined;

                (u as any).password = undefined;
                (u as any).id       = undefined;
            });

            return res.status(200).json({ users });
        } catch (e) {
            console.error(`\n\n---> ERROR: ${e}`);
            return res.status(500).json({ message: "Ocorreu um erro interno no servidor." });
        }
    }

    static async delete(req: Request, res: Response): Promise<Response>
    {
        try {
            const user:   User = req.body.user;
            const target: User = req.body.target;

            await UserController.userRepository.remove(target);
            if (target.id) RefreshService.revoke(target.id);

            return res.status(204).send();
        } catch (e) {
            console.error(`\n\n---> ERROR: ${e}`);
            return res.status(500).json({ message: "Ocorreu um erro interno no servidor." });
        }
    }

    static async update(req: Request, res: Response): Promise<Response> 
    {
        try {
            const user:   User = req.body.user;
            const target: User = req.body.target; 
            
            const { newUsername, newEmail, newPassword } = req.body;
        
            if (newEmail && newEmail !== target.email && await UserController.userRepository.findByEmail(newEmail))
                return res.status(409).json({ message: "O E-mail fornecido já está em uso!" });
            
            if (newUsername) target.username = newUsername;

            if (newPassword) {
                target.password = newPassword;
                if (target.id) RefreshService.revoke(target.id);
            }

            if (newEmail)    target.email    = newEmail;

            const updated = await UserController.userRepository.save(target);
            if (newPassword && updated) return UserController.refresh(req, res);
            return res.status(204).send();
        } catch (e) {
            console.error(`\n\n---> ERROR: ${e}`);
            return res.status(500).json({ message: "Ocorreu um erro interno no servidor." });
        }
    }
}