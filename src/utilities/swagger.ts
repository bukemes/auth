import swaggerJSDoc from 'swagger-jsdoc';
const port = process.env.PORT || 9001;

const openapiOptions: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Bukemes (possible future rebranding: Bukin)\'s API',
            version: '1.0.0',
            description: 'This is the backend API of Bukemes, a Booking Content Management System. \n \
                          It is responsible for connecting the administrative frontend to the database, \n \
                          alongside providing routes to populate your website with managed data.',
        },
        servers: [
            {
                url:`http://localhost:${port}/api`,
                description: 'Local server',
            }
        ],
        components:{
            securitySchemes: {
                bearerAuth:{
                    type: 'http',
                    scheme: 'bearer',
                    bearerformat: 'JWT'
                }
            }
        },
        security: [{
            bearerAuth: []
        }],
        host: 'localhost:9001',
        basePath: '/api/v1',
    },
    apis: [
        './src/routers/*.ts',
        './src/models/*.ts',
        './src/controllers/*.ts',
        './src/routers/*.js',
        './src/models/*.js',
        './src/controllers/*.js'
    ],
};

const openapiSpecification = swaggerJSDoc(openapiOptions);

export default openapiSpecification;

// import swaggerUi from 'swagger-ui-express';
// import { Application } from 'express';

// export default function initializeSwagger(app: Application) {
//     app.use('/docs', swaggerUI.serve, swaggerUI.setup(openapiSpecification));
// }