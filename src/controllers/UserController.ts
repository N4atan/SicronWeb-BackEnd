import {randomUUID} from 'crypto';
import {Request, Response} from 'express';

import {COOKIE_NAMES} from '../config/cookies';
import {User, UserRole} from '../entities/User';
import {UserRepository} from '../repositories/UserRepository';
import {AuthService} from '../services/AuthService';
import {CryptService} from '../services/CryptService';
import {RefreshService} from '../services/RefreshService';
import {TokenService, UserPayload} from '../services/TokenService';
import {AuthUtil} from '../utils/AuthUtil';
import {setSessionIdSessionCookie} from '../utils/cookieUtils';
import logger from '../utils/logger';

/**
 * Controller for managing User operations and Authentication.
 */
export class UserController
{
    public static userRepo = new UserRepository();

    /**
     * Registers a new User.
     *
     * @param req - Express Request object containing user details.
     * @param res - Express Response object.
     * @returns Promise<Response> - The created User or error.
     */
    static async register(req: Request, res: Response):
        Promise<Response>
    {
        const {username, email, password, role} = req.body;

        if ((req.logged || req.user) &&
            req.user?.role !== UserRole.ADMIN)
            return res.status(403).json(
                {message: 'Permissão negada!'});

        if (!username || !email || !password)
            return res.status(400).json({
                message: 'Os campos necessários não foram fornecidos!'
            });

        if (await UserController.userRepo.findByEmail(email))
            return res.status(409).json(
                {message: 'O E-Mail fornecido já possui registro!'});

        const userRole = req.user?.role === UserRole.ADMIN && role ?
            role :
            undefined;

        const user =
            new User({username, email, password, role: userRole});

        await UserController.userRepo.createAndSave(user);
        return res.status(201).location(`/users/${user.uuid}`).send();
    }

    /**
     * Checks if the user is currently logged in.
     *
     * @param req - Express Request object.
     * @param res - Express Response object.
     * @returns Promise<Response> - 200 OK if logged in, 401
     *     Unauthorized otherwise.
     */
    static async isLogged(req: Request, res: Response):
        Promise<Response>
    {
        if (req.logged || req.user) {
            const userWithRelations =
                await UserController.userRepo.findByUUID(
                    req.user!.uuid) as Partial<User>;

            logger.debug(
                'UserController.isLogged - user present',
                {uuid: req.user!.uuid});
            if (userWithRelations) {
                const safe = {...userWithRelations} as Partial<User>;
                const safeObj = safe as Record<string, unknown>;
                delete safeObj.password;
                delete safeObj.id;
                delete safeObj.previous_password;
                
                logger.table(safe);
                return res.status(200).json(safe);
            }
        }

        logger.debug('UserController.isLogged - not logged');
        return res.status(401).send();
    }

    /**
     * Authenticates a user and sets session cookies.
     *
     * @param req - Express Request object containing email and
     *     password.
     * @param res - Express Response object.
     * @returns Promise<Response> - 204 No Content or error.
     */
    static async login(req: Request, res: Response): Promise<Response>
    {
        const {email, password} = req.body;
        if (req.logged) return res.status(400).send();

        if (!email || !password)
            return res.status(400).json(
                {message: 'E-Mail ou senha não foram fornecidos!'});

        const user = await UserController.userRepo.findByEmail(email);

        if (!user || !user.id ||
            !(await CryptService.compare(password, user.password))) {
            logger.warn(
                'UserController.login - invalid credentials',
                {email});
            return res.status(404).json(
                {message: 'E-Mail e/ou senha estão incorretos.'});
        }


        // Determine session identifier: cookie only. If none present,
        // generate a server-side sessionId (randomUUID) and set it as
        // a session cookie.
        let sessionId =
            req.cookies[COOKIE_NAMES.SESSION_ID] as string |
            undefined;

        if (!sessionId) {
            sessionId = randomUUID();
            setSessionIdSessionCookie(res, sessionId);
        }

        await AuthUtil.login(res, user, sessionId!);

        logger.info(
            'UserController.login - success',
            {uuid: user.uuid, email: user.email});

        return res.status(204).send();
    }

    /**
     * Refreshes the authentication token.
     *
     * @param req - Express Request object containing refresh token
     *     cookie.
     * @param res - Express Response object.
     * @returns Promise<Response> - 204 No Content with new cookies,
     *     or error.
     */
    static async refresh(req: Request, res: Response):
        Promise<Response>
    {
        const user = req.user!;
        const token = req.cookies[COOKIE_NAMES.REFRESH_TOKEN];
        if (!token)
            return res.status(400).json(
                {message: 'Refresh token not provided'});

        const payload =
            TokenService.verifyRefresh(token) as UserPayload;

        const sessionId =
            (req.cookies[COOKIE_NAMES.SESSION_ID] as string) ||
            undefined;

        if (!sessionId)
            return res.status(403).json(
                {message: 'Session identifier required'});

        if (!payload || user.uuid !== payload.id || !user.uuid) {
            return res.status(403).json({
                message:
                    'Dados inválidos fornecidos ao serviço de autentificação!'
            });
        }

        const valid = await RefreshService.isValid(
            payload.id, token, sessionId);
        if (!valid)
            return res.status(403).json({
                message:
                    'Dados inválidos fornecidos ao serviço de autentificação!'
            });

        await AuthUtil.refresh(res, user, token, sessionId);
        logger.info(
            'UserController.refresh - success', {uuid: user.uuid});
        return this.isLogged(req, res);
    }

    /**
     * Logs out the user by clearing session cookies.
     *
     * @param req - Express Request object.
     * @param res - Express Response object.
     * @returns Promise<Response> - 204 No Content.
     */
    static async logout(req: Request, res: Response):
        Promise<Response>
    {
        const token = req.cookies[COOKIE_NAMES.REFRESH_TOKEN];
        const sessionId =
            (req.cookies[COOKIE_NAMES.SESSION_ID] as string) ||
            undefined;

        await AuthUtil.logout(res, token, sessionId);
        logger.info('UserController.logout - success', {sessionId});
        return res.status(204).send();
    }

    /**
     * Queries Users based on filters.
     *
     * @param req - Express Request object containing query filters.
     * @param res - Express Response object.
     * @returns Promise<Response> - List of Users matching criteria.
     */
    static async query(req: Request, res: Response): Promise<Response>
    {
        const user = req.user!;

        const filters = (req.query || {}) as Record<string, unknown>;
        const users =
            await UserController.userRepo.findAll({where: filters});

        const safeUsers = users.map((u) => {
            const userResponse: Partial<User> = {...u} as
                Partial<User>;

            if (user?.role !== UserRole.ADMIN && user?.id !== u.id) {
                delete (userResponse as Partial<User>).email;
                delete (userResponse as Partial<User>).blockedNGOs;
                delete (userResponse as Partial<User>)
                    .blockedSuppliers;
            }

            delete (userResponse as Partial<User>).password;
            delete (userResponse as Partial<User>).previous_password;
            delete (userResponse as Partial<User>).id;

            return userResponse;
        });

        return res.status(200).json({users: safeUsers});
    }

    /**
     * Deletes a User.
     *
     * @param req - Express Request object.
     * @param res - Express Response object.
     * @returns Promise<Response> - 204 No Content.
     */
    static async delete(req: Request, res: Response):
        Promise<Response>
    {
        const target = req.target!;

        await UserController.userRepo.remove(target);
        await RefreshService.revoke(target.uuid);

        return res.status(204).send();
    }

    /**
     * Updates a User's details.
     *
     * @param req - Express Request object containing updates.
     * @param res - Express Response object.
     * @returns Promise<Response> - 204 No Content or error.
     */
    static async update(req: Request, res: Response):
        Promise<Response>
    {
        const target = req.target!;

        const {
            newUsername,
            newEmail,
            newPassword,
            username,
            email,
            password,
            role,
        } = req.body;

        const updatedUsername = newUsername || username;
        const updatedEmail = newEmail || email;
        const updatedPassword = newPassword || password;

        if (updatedEmail && updatedEmail !== target.email &&
            (await UserController.userRepo.findByEmail(updatedEmail)))
            return res.status(409).json(
                {message: 'O E-mail fornecido já está em uso!'});

        if (updatedUsername) target.username = updatedUsername;

        if (role && req.user!.role === UserRole.ADMIN) {
            target.role = role;
        }

        if (updatedPassword) {
            target.password = updatedPassword;
            await RefreshService.revoke(target.uuid);
        }

        if (updatedEmail) target.email = updatedEmail;

        await UserController.userRepo.save(target);

        return res.status(204).send();
    }
}
