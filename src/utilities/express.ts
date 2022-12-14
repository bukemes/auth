// config & init
import express, { Application, Request, Response } from 'express';
// middleware
import compression from 'compression';
// security
import helmet from 'helmet'; // import xss from 'xss'; -> helmet.xss(); takes care of that.
import cors from 'cors'; // helmet contains cors? need to check. 
// documentation
import swaggerUI from 'swagger-ui-express';
import openapiSpecification from './swagger';
// utilities
// import logger from './logger';
import { handleBodyParserErrors } from './utils';
// routes
import authRouter from '../routers/authRouter';

// this was neccesary to split out so I could use the it with JEST & SUPERTEST
export default function setupExpress(){
    const app: Application = express(); // create express app
    // app.locals.connected_to_db = false; // set connected_to_db to false
    // MIDDLEWARE
    
    // security
    // app.use(helmet()); // xss and other stuff
    app.use(cors()); // cors

    // json
    app.use(express.json()); // json, defaults to {strict:true}
    app.use(handleBodyParserErrors); // handle express.json's bodyparses errors in case of eg bad json

    // API routes
    app.use('/auth', authRouter);

    // Docs
    app.use('/auth/docs', swaggerUI.serve, swaggerUI.setup(openapiSpecification));

    // redirect to docs cases
    // app.use('/api/', redirectToDocs);
    // app.use('/api', redirectToDocs);
    // // app.use('/', redirectToDocs);

    // React
    // app.use('/admin', express.static('public')); // serve static files from public folder, put React Admin here when deploying
    // app.use('/site', express.static('public/site')); // serve static files from public folder, put React App here when deploying

    // efficiency
    app.use(compression()); // gzip

    return app;
}

// const redirectToDocs = (req: Request, res: Response) => {
//     res.redirect('/docs');
// };