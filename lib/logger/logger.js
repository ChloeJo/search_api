import winston from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';
import config from 'config';
import { resolve } from 'path';
import { fileURLToPath} from 'url';

console.log('Logger start');

const cache = new Map();

export const Logger = metaUrl => {
    const root = resolve('./');
    const file = fileURLToPath(new URL(metaUrl));
    const filePath = file.replace(root, '');

    console.log('file: ', file);
    console.log('filePath: ', filePath);

    if(cache.has(filePath)){
        return cache.get(filePath);
    }

    const loggerConfig = config.get('app.logger');
    const path = loggerConfig.path || process.cwd();
    const errorConfig = loggerConfig.error;
    const infoConfig = loggerConfig.info;
    const debugConfig = loggerConfig.debug;

    // 로그 레벨 
    const levels = {
        error: 0,
        info: 1, 
        debug: 2
    };

    const level = () => {
        const env = process.env.NODE_ENV || 'devlopment';
        const isDevelopment = env === 'development'
        return isDevelopment ? 'debug' : 'debug'
    };

    // 로그 색상
    const colors = {
        error: 'red',
        info: 'green',
        debug: 'white'
    };

    winston.addColors(colors);

    // 로그 포맷
    const customFormat = winston.format.printf(({ level, message, timestamp, stack }) => 
    `${timestamp} [${level}][${process.env.INSTANCE_ID}] ${filePath}: ${stack || message}`);

    const format = winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        customFormat
    )

    const transports = [
        new WinstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD',
            dirname: `${path}/logs/error`,
            filename: '%DATE%.error.log',
            maxFiles: errorConfig.maxFiles || 90,
            maxSize: errorConfig.maxSize || '100m',
            zippedArchive: true
        }),
        new WinstonDaily({
            level: 'info',
            datePattern: 'YYYY-MM-DD',
            dirname: `${path}/logs/info`,
            filename: '%DATE%.info.log',
            maxFiles: infoConfig.maxFiles || 30,
            maxSize: infoConfig.maxSize || '100m',
            zippedArchive: true
        }),
        new WinstonDaily({
            level: 'debug',
            datePattern: 'YYYY-MM-DD',
            dirname: `${path}/logs/debug`,
            filename: '%DATE%.debug.log',
            maxFiles: debugConfig.maxFiles || 1,
            maxSize: debugConfig.maxSize || '500m',
            zippedArchive: true
        })
    ];

    if(process.env.NODE_ENV !== 'production'){
        transports.push(new winston.transports.Console()) // 개발 중에는 콘솔에 
    }

    const logger = winston.createLogger({
        level: level(),
        levels,
        format, 
        transports
    });

    cache.set(filePath, logger);
    
    console.log('Logger end');

    return logger;
}




