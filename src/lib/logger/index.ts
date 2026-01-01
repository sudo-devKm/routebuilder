import winston from 'winston';
import { envs } from '@/config';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, printf, colorize, errors, timestamp, json } = winston.format;

const devFormat = printf(({ level, message, timestamp: logTimeStamp, ...meta }) => {
  return `${logTimeStamp} [${level}] ${message} ${Object.keys(meta)?.length > 0 ? JSON.stringify(meta, null, 2) : ''}`;
});

const dailyRotationFile = (level: string) => {
  return new DailyRotateFile({
    level,
    datePattern: 'YYYY-MM-DD',
    filename: `logs/${level}/%DATE%.log`,
    auditFile: `logs/${level}/${level}-audit.json`,
    maxSize: '20m',
    maxFiles: '14d',
  });
};

const createWinstonLogger = () => {
  return winston.createLogger({
    level: envs.isDevelopment ? 'debug' : 'info',
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      envs.isProduction ? json() : devFormat,
    ),
    transports: [dailyRotationFile('error'), dailyRotationFile('info')],
  });
};

const logger = createWinstonLogger();

if (envs.isDevelopment) {
  logger.add(
    new winston.transports.Console({
      format: combine(timestamp({ format: 'HH:mm:ss' }), colorize(), devFormat),
    }),
  );
}

export default logger;
