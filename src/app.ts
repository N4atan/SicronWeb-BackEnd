import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, {Application} from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import {errorHandler} from './middlewares/errorHandler';
import IndexRouter from './routers/index';

/**
 * Main Application Class
 * Encapsulates Express configuration, middlewares, and routes.
 */
export class App
{
    public app: Application;

    /**
     * Initializes the application.
     */
    constructor()
    {
        this.app = express();
        this.config();
        this.routes();
        this.errorHandling();
    }

    /**
     * Configures global middlewares.
     * Use: cookie-parser, express.json, cors (development), helmet
     * (security), rate-limit.
     */
    private config(): void
    {
        this.app.set('trust proxy', true);

        this.app.use(cookieParser());
        this.app.use(express.json());
        this.app.use(compression());
        
        // Configure CORS: prefer explicit allowlist via
        // ALLOWED_ORIGINS; fall back to permissive in
        // non-production for developer convenience.
        this.app.use(
            cors({
                origin: (origin, callback) => {
                    return callback(null, origin || true);
                },
                credentials: true,
            }),
        );

        this.app.use(
            helmet({
                contentSecurityPolicy: {
                    directives: {
                        defaultSrc: ['\'self\''],
                    },
                },
                crossOriginEmbedderPolicy: false,
            }),
        );

        this.app.use(
            rateLimit({
                windowMs: 15 * 60 * 1000,
                max: 7000,
                standardHeaders: true,
                legacyHeaders: false,
                message: {
                    message:
                        'Muitas requisições. Tente novamente mais tarde.'
                },
            }),
        );
    }

    /**
     * Configures API routes.
     * Mounts the IndexRouter at root and provides a health check
     * endpoint.
     */
    private routes(): void
    {
        this.app.use('/', IndexRouter);

        // Health check
        this.app.get('/', (_req, res) => {
            res.status(200).json({message: 'Server is up.'});
        });
    }

    /**
     * Configures global error handling.
     * Must be called after all routes.
     */
    private errorHandling(): void
    {
        this.app.use(errorHandler);
    }
}
