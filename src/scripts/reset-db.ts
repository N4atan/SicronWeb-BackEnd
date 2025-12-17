import 'reflect-metadata';

import readline from 'readline';

import {AppDataSource} from '../config/data-source';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function resetDatabase()
{
    console.warn(
        '\n DANGER: This will DROP ALL TABLES and recreate the schema!');
    console.warn(
        '    Target Database: ' + AppDataSource.options.database);

    rl.question('Are you sure? (y/N): ', async (answer) => {
        if (answer.toLowerCase() !== 'y') {
            console.log('Aborted.');
            process.exit(0);
        }

        console.log('\nConnecting...');
        try {
            await AppDataSource.initialize();

            console.log('Dropping Schema...');
            await AppDataSource.dropDatabase();

            console.log('Synchronizing Schema...');
            await AppDataSource.synchronize();

            console.log('Database Reset Complete!');
        } catch (error) {
            console.error('Error resetting database:', error);
        } finally {
            await AppDataSource.destroy();
            process.exit(0);
        }
    });
}

resetDatabase();
