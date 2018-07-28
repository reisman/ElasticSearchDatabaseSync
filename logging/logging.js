const winston = require('winston');

const configuration = {
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
};

const logger = winston.createLogger(configuration);

if (process.env.NODE_ENV !== 'production') {
    const options = {
        format: winston.format.simple(),
    };

    logger.add(new winston.transports.Console(options));
};

module.exports = logger;