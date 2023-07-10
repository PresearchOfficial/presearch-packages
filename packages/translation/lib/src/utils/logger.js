import { format, transports } from 'winston';
import { logger } from '../sdk-core';

const combinedFormat = format.combine(
  format.timestamp(),
  format.json()
);
const errorLogger = new transports.File({
  format: combinedFormat,
  filename: './logs/error.log',
  level: 'error'
});
const combinedLogger = new transports.File({
  format: combinedFormat,
  filename: './logs/combined.log',
  level: 'info'
});

logger.add(combinedLogger).add(errorLogger);
