/**
 * utils/logger.js
 * @description :: Logger utility for logging messages
 */

const winston = require('winston');

// Define logger configuration
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Export logger instance
module.exports = logger;
