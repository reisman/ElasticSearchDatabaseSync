const sql = require('mssql');
const logger = require('./../logging/logging');

const executeStream = (configuration, query, onRow, onFinished, onError) => {
    sql.connect(sqlConfiguration, err => {
        const request = new sql.Request();
        request.stream = true;
        request.query(query);
    
        request.on('row', row => {
            onRow(row);
        });
    
        request.on('error', err => {
            logger.error(err);
            if (onError) {
                onError(err);
            }
        });
    
        request.on('done', result => {
            logger.info("Query finished");
            if (onFinished) {
                onFinished(result);
            }
        });
    });    
};

sql.on('error', err => {
    logger.error(err);
});

module.exports = {
    executeStream,
};