const sql = require('mssql');
const logger = require('./../logging/logging');

const executeStream = async (sqlConfiguration, query, onRow, onFinished, onError) => {
    return sql.connect(sqlConfiguration)
        .then(pool => {
            const request = pool.request();
            request.stream = true;
    
            request.on('row', onRow);

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

            var result = request.query(query);
            return result;
        })
        .then(() => sql.close()); 
};

sql.on('error', err => {
    logger.error(err);
});

module.exports = {
    executeStream,
};