import App from './app';
import Routes from '@/routes';

const bootstrap = async () => {
    const application = new App(Routes);
    await application.listen();
};

bootstrap();
