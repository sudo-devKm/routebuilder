// ==================== Import Packages ========================
import hpp from 'hpp';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { envs } from '@/config';
import { AppRoute } from './types';
import MongoConnect from '@/database/dbConnect';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { errorHandler } from '@/middlewares/error.handler.middleware';

export default class App {
    private readonly env: string;
    private readonly port: number;
    private readonly app: express.Application;
    private readonly routes: AppRoute[] = [];
    public server?: Server<typeof IncomingMessage, typeof ServerResponse>;

    constructor(routes: AppRoute[]) {
        this.app = express();
        this.env = envs.NODE_ENV || 'development';
        this.routes = routes;
        this.port = envs.PORT || 5000;
    }

    public readonly listen = async () => {
        await MongoConnect.connect(envs.DB_URI || '');
        this.setMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandler();
        this.server = this.app.listen(this.port, () => {
            process.stdout.write('=====================================\n');
            process.stdout.write(`========= ENV: ${this.env} ==========\n`);
            process.stdout.write(`  🚀 App listening on the port ${this.port}\n`);
            process.stdout.write(`=====================================\n`);
        });
    };

    private readonly setMiddlewares = () => {
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(hpp());
        this.app.use(compression());
        this.app.use(morgan('dev'));
    };

    private readonly initializeRoutes = () => {
        this.routes.map((route) => {
            this.app.use('/', route.router);
        });
    };

    private readonly initializeErrorHandler = () => {
        this.app.use(errorHandler);
    };
}
