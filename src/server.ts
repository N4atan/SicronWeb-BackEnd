import {App} from './app';
import {AppDataSource} from './config/data-source';
import {ENV} from './config/env';
import logger from './utils/logger';

const port: number = ENV.PORT;

/**
 * Server Entry Point
 * Initializes Database and starts the Express server.
 */
AppDataSource.initialize()
    .then(() => {
        const application = new App();

        application.app.listen(port, () => {
            logger.info('Server is running on port: ' + port);
        });
    })
    .catch((e) => {
        logger.error(
            'An error has occurred during program initialization: ' +
            e);
    });
