import express, { Application, NextFunction } from 'express';
import cookieParser             from "cookie-parser";
import cors                     from 'cors';
import helmet                   from 'helmet';
import rateLimit                from 'express-rate-limit';

import { AppDataSource } from "./config/data-source";

import UserRoutes from './routers/UserRoutes';
import NGORoutes  from './routers/NGORoutes';

import { errorHandler } from './middlewares/errorHandler';

const app:  Application = express();
const port: number      = Number(process.env.PORT) || 3000;

app.set('trust proxy', true);

app.use(cookieParser());
app.use(express.json());

app.use(cors({
	origin: (origin, callback) => callback(null, origin || true),
	credentials: true,
}));  

app.use(helmet({
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"]
		}
	},
	crossOriginEmbedderPolicy: false
}));

app.use(rateLimit({
	windowMs:        15 * 60 * 1000,
	max:             100,
	standardHeaders: true,
	legacyHeaders:   false,
	message: { message: "Muitas requisições. Tente novamente mais tarde." }
}));

app.use("/user", UserRoutes);
app.use("/ngo",  NGORoutes); 

app.get("/", (_req, res) => {
    res.status(201).json({message: "Server is up."});
});

app.use(errorHandler);

AppDataSource.initialize().then(() => {
    console.log("Data source has been initialized!");
    app.listen(port, () => {
        console.log("Serving is running on port: " + port);
    });
}).catch((e) => {
    console.error("INIT ERROR: " + e);
});
