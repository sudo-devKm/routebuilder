// ==================== Import Packages ========================
import hpp from 'hpp';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';
import { envs } from '@/config';
import logger from '@/lib/logger';
import { AppRoute } from './types';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import MongoConnect from '@/lib/database/dbConnect';
import { Server, IncomingMessage, ServerResponse } from 'http';
import { errorHandler } from '@/middlewares/error.handler.middleware';

// Main application class that sets up and manages the Express server
export default class App {
  // Store the current environment mode (development/production)
  private readonly env: string;
  // Port number on which the server listens
  private readonly port: number;
  // Express application instance
  private readonly app: express.Application;
  // Collection of route handlers to be registered
  private readonly routes: AppRoute[] = [];
  // HTTP server instance created when the app starts listening
  public server?: Server<typeof IncomingMessage, typeof ServerResponse>;

  // Initialize the application with provided routes
  constructor(routes: AppRoute[]) {
    // Create a new Express application instance
    this.app = express();
    // Set the environment from config or default to development
    this.env = envs.NODE_ENV || 'development';
    // Store the routes array for later registration
    this.routes = routes;
    // Set the port from config or default to 5000
    this.port = envs.PORT || 5000;
  }

  // Start the application server and initialize all components
  public readonly listen = async () => {
    // Establish connection to MongoDB database
    await MongoConnect.connect(envs.DB_URI || '');
    // Apply all middleware to the application
    this.setMiddlewares();
    // Register all route handlers
    this.initializeRoutes();
    // Set up the global error handling middleware
    this.initializeErrorHandler();
    // Set up graceful shutdown handlers for process signals
    this.setupGracefulShutdown();
    // Start the HTTP server and listen on the configured port
    this.server = this.app.listen(this.port, () => {
      // Output banner separator line
      logger.info('=====================================');
      // Display current environment
      logger.info(`========= ENV: ${this.env} ==========`);
      // Show server listening message with port number
      logger.info(`  🚀 App listening on the port ${this.port}`);
      // Output closing banner separator line
      logger.info(`=====================================`);
    });
  };

  // Configure and register all middleware in the correct order
  private readonly setMiddlewares = () => {
    // Enable trust proxy.
    this.app.enable('trust proxy');
    // Apply helmet for security headers
    this.app.use(helmet());
    // Enable CORS for cross-origin requests
    this.app.use(cors());
    // Parse incoming JSON request bodies
    this.app.use(express.json());
    // Parse URL-encoded request bodies with extended syntax
    this.app.use(express.urlencoded({ extended: true }));
    // Parse cookies from request headers
    this.app.use(cookieParser());
    // Protect against HTTP Parameter Pollution
    this.app.use(hpp());
    // Compress response bodies for better performance
    this.app.use(compression());
    // Log HTTP requests in development format
    this.app.use(morgan('dev'));
  };

  // Register all application routes with the Express app
  private readonly initializeRoutes = () => {
    // Iterate through each route and mount it to the application
    this.routes.map((route) => {
      // Mount the route's router at the root path
      this.app.use('/', route.router);
    });
  };

  // Set up the global error handler (must be registered last)
  private readonly initializeErrorHandler = () => {
    // Apply the error handler middleware to catch all errors
    this.app.use(errorHandler);
  };

  // Perform cleanup operations before shutting down the application
  private readonly cleanup = async (): Promise<void> => {
    // Close the HTTP server if it's running
    if (this.server) {
      // Stop accepting new connections and close existing ones
      this.server.close(() => {
        // Log that the server has been closed
        logger.info('HTTP server closed');
      });
    }

    // Close MongoDB database connection
    try {
      // Disconnect from the database gracefully
      await MongoConnect.disconnect();
      // Log successful database disconnection
      logger.info('Database connection closed');
    } catch (error) {
      // Log any errors during database disconnection
      logger.error('Error closing database connection:', error);
    }
  };

  // Handle graceful shutdown when receiving termination signals
  private readonly handleShutdown = async (signal: string): Promise<void> => {
    // Log the received signal
    logger.info(`${signal} signal received: closing HTTP server`);

    // Perform cleanup operations
    await this.cleanup();

    // Exit the process with success code
    process.exit(0);
  };

  // Set up listeners for process signals and unhandled errors
  private readonly setupGracefulShutdown = (): void => {
    // Handle SIGTERM signal (typically sent by process managers)
    process.on('SIGTERM', async () => {
      // Trigger graceful shutdown for SIGTERM
      await this.handleShutdown('SIGTERM');
    });

    // Handle SIGINT signal (Ctrl+C in terminal)
    process.on('SIGINT', async () => {
      // Trigger graceful shutdown for SIGINT
      await this.handleShutdown('SIGINT');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', async (reason: any, promise: Promise<any>) => {
      // Log the unhandled rejection details
      process.stderr.write(`Unhandled Rejection at: ${promise}, reason: ${reason}\n`);
      // Perform cleanup before exiting
      await this.cleanup();
      // Exit with error code
      process.exit(1);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', async (error: Error) => {
      // Log the uncaught exception
      process.stderr.write(`Uncaught Exception: ${error.message}\n`);
      // Log the stack trace for debugging
      process.stderr.write(`Stack: ${error.stack}\n`);
      // Perform cleanup before exiting
      await this.cleanup();
      // Exit with error code
      process.exit(1);
    });
  };
}
