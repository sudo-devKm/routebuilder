import App from './app';
import Routes from '@/routes';

// Bootstrap the application and handle startup errors
const bootstrap = async () => {
  try {
    const application = new App(Routes);
    await application.listen();
  } catch (error) {
    // Log any errors during startup and exit with failure code
    console.error('Failed to start application:', error);
    process.exit(1);
  }
};

bootstrap();
