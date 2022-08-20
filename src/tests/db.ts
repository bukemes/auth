import mongoose, { ConnectOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// const mongoDB = new MongoMemoryServer();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let mongoDB: any = null;

export const connect = async () => {
    mongoDB = await MongoMemoryServer.create();
    const uri = await mongoDB.getUri();
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10
    };

    await mongoose.connect(uri, options as ConnectOptions); // , options
};

export const close = async () => {
    // if(mongoDB !== null) {
    //     await mongoose.connection.dropDatabase();
    //     await mongoose.connection.close();
    //     await mongoDB.stop;
    // }
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoDB.stop;
};

export const clear = async () => {
    // if(mongoDB !== null) {
    //     const collections = mongoose.connection.collections;
    //     for (const key in collections) {
    //         const collection = collections[key];
    //         await collection.deleteMany({});
    //     }
    // }
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
};