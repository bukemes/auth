// config
import dotenv from 'dotenv';
// db
// import mongoose from 'mongoose';
// custom
import logger from './utilities/logger';
import setupExpress from './utilities/express';
import setupMongoose from './utilities/database';
import { checkEnvVariables } from './utilities/utils';
import seed from './utilities/seed';

// setup
dotenv.config(); // get environment variables
checkEnvVariables();
app();
// logger.info(process.env);

async function app() {
    const db = await setupMongoose();

    db.once('open', async function() {
        const express = setupExpress();
        await seed();
        const port = process.env.PORT || 9001; // create port variable
    
        // only start listening once connected to db
        express.listen(port, () => {
            logger.info(`AUTH is running at http://localhost:${port}/auth/`);
            // logger.info(`Swagger is running at http://localhost:${port}/docs`);
        });
    });
    
}

