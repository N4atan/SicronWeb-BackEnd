import {App} from './app';
import {AppDataSource} from './config/data-source';
import {ENV} from './config/env';

const port: number = ENV.PORT;

/**
 * Server Entry Point
 * Initializes Database and starts the Express server.
 */
AppDataSource.initialize()
    .then(() => {
        console.log('Data source has been initialized!');

        const application = new App();

        application.app.listen(port, () => {
            console.log('Server is running on port: ' + port);
        });
    })
    .catch((e) => {
        console.error('INIT ERROR: ' + e);
    });
