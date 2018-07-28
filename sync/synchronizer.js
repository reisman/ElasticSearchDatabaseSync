const db = require('./sqlserveraccess');
const logger = require('../logging/logging');

const updateBulk = configuration => {
    const { mappings, sqlConfiguration } = configuration;
    
    const onFinished = result => {
        logger.info('Finished bulk update');
    };

    const onError = error => {
        logger.error(error);
    };

    mappings.forEach(mapping => {
        const { table, columns, identityColumn, index } = mapping;
        const joinedColumns = columns.join(',');
        const query = `SELECT ${joinedColumns} FROM ${table}`;
        
        const bufferSize = 100;
        const buffer = new Array(bufferSize);
        let idx = 0;
        const onRow = row => {
            if (idx < bufferSize - 1) {
                    
                buffer = new Array(bufferSize);
                idx++;
            } else {
                buffer[idx] = row;
                idx = 0;
            }
        };

        db.executeStream(sqlConfiguration, query, onRow, onFinished, onError);        
    });
};

module.exports = {
    updateBulk,
};