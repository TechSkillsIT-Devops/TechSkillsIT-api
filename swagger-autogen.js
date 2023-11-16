const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
const endpointsFiles = ['./index.js'];

const config = {
    info: {
        title: 'Blog API Documentation',
        description: '',
    },
    tags: [ ],
    host: 'localhost:5000',
    schemes: ['http', 'https'],
};

swaggerAutogen(outputFile, endpointsFiles, config);