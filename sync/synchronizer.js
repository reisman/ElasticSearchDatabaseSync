const db = require('../database/sqlserver');
const logger = require('../logging/logging');
const data = require('../search/operations');

const updateBulk = async configuration => {
    const { mappingConfiguration, sqlConfiguration } = configuration;
   
    const onError = error => {
        logger.error(error);
    };

    const asyncForEach = async (array, action) => {
        for (let idx = 0; idx < array.length; idx++) {
            await action(array[idx])
        }
    };

    await asyncForEach(mappingConfiguration, async mapping => {
        const { type, columns, index, identityColumn } = mapping;
        const joinedColumns = columns.join(',');
        const query = `SELECT ${joinedColumns} FROM ${type}`;
        
        const bufferSize = 100;
        const buffer = [];
        let idx = 0;
        const onRow = async row => {
            if (idx >= bufferSize - 1) { 
                await data.indexBulk(index, type, buffer, identityColumn);
                buffer = [];
                idx = 0;
            }
            
            buffer.push(row);
            idx++;
        };

        await db.executeStream(sqlConfiguration, query, onRow, null, onError);        

        if (idx > 0) {
            await data.indexBulk(index, type, buffer, identityColumn);
        }
    });

    logger.info('Bulk update finished')
};

module.exports = {
    updateBulk,
};