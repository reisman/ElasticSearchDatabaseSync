const db = require('../database/sqlserver');
const logger = require('../logging/logging');
const data = require('../search/operations');
const { asyncForEach } = require('../utils/utils')

const updateBulk = async configuration => {
    const { mappingConfiguration, sqlConfiguration } = configuration;
   
    const onError = error => {
        logger.error(error);
    };

    await asyncForEach(mappingConfiguration, async mapping => {
        const { type, columns, index, identityColumn } = mapping;
        const joinedColumns = columns.join(',');
        const query = `SELECT ${joinedColumns} FROM ${type}`;
        
        const bufferSize = 100;
        var buffer = [];
        let idx = 0;
        const onRow = row => {
            if (idx >= bufferSize) { 
                data.indexBulk(index, type, buffer, identityColumn);
                buffer.length = 0;
                idx = 0;
            }
            
            buffer.push(row);
            idx++;
        };

        await db.executeStream(sqlConfiguration, query, onRow, null, onError);        

        if (idx > 0) {
            data.indexBulk(index, type, buffer, identityColumn);
        }
    });

    logger.info('Bulk update finished')
};

module.exports = {
    updateBulk,
};