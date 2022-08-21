import mongoose from 'mongoose';
import logger from './logger';

// logger.console;
// logger.db;
// OR
// console.log("info-to-console"); -> could be custom .logger implementation
// logger.log("info-to-db");

export default async function setupMongoose(): Promise<mongoose.Connection> {
    const mongo = {
        user: process.env.MONGO_USER,
        pass: process.env.MONGO_PASSWORD,
        host: process.env.MONGO_HOST,
        port: process.env.MONGO_PORT,
        name: process.env.MONGO_DB || 'bukemes', // database name
        auth: process.env.MONGO_AUTH_SOURCE
    };

    const URI = `mongodb://${mongo.user}:${mongo.pass}@${mongo.host}:${mongo.port}/${mongo.name}?authSource=${mongo.auth}`;
    // logger.info(URI);

    // connect to DB
    mongoose.connect(URI)
        // .then(() => {
        //     logger.info('database.ts: Connected to MongoDB');
        // })
        .catch((error) => {
            logger.error('Failed to connect to MongoDB');
            logger.error(error.message);
            process.exit(1);
        });
    
    const db = mongoose.connection;
    
    // middleware, log errors; 
    db.on('error', error => {
        logger.error(error.message);
    });

    db.on('open', () => {
        logger.info('open connection to mongo server.');
    });
    
    db.on('connected', () => {
        logger.info('connected to mongo server.');
    });

    db.on('disconnected', () => {
        // connected=false;
        logger.warn('disconnected from mongo server.');
        // logger.
    });
    
    db.on('close', () => {
        // connected=false;
        logger.warn('close connection to mongo server');
    });

    return db;
}


// // 0 = disconnected
// // 1 = connected
// // 2 = connecting
// // 3 = disconnecting
// // 99 = uninitialized
// // if(db.readyState !== 1){
// //     logger.error('MongoDB is not connected');
// //     process.exit(1);
// // }
// logger.info('db.readyState: ' + db.readyState);