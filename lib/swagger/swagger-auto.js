import swaggerAutogen from 'swagger-autogen';
import { fileURLToPath } from 'url';
import path from 'path';
import config from 'config';

console.log('Swagger start');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('import.meta.url: ', import.meta.url);
console.log('__filename: ', __filename);
console.log('__dirname: ', __dirname);

console.log(`Swagger-autogen ENV: ${process.env['NODE_CONFIG_ENV']}`);

// swagger 셋팅
const doc = {
    info: {
        title: 'Final Search',
        description: 'final-search proejct test api',
    },
    host: `${config.get('app.swagger.host')}:${config.get('app.port')}`,
    schemes: ['http']
};

// swagger ouput 저장경로 
const outputFile = path.join(__dirname, 'swagger-output.json');
// swagger 적용파일
const endpointsFiles = ['./app.js'];

swaggerAutogen()(outputFile, endpointsFiles, doc);

console.log('Swagger end');