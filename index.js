const indices = require('./search/indices');
const data = require('./search/operations');
const search = require('./search/search');
const sql = require('./database/sqlserver');
const config = require('config');
const sync = require('./sync/synchronizer');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const configuration = config.get('DatabaseConfig');
const indexName = 'parts';

const updateConfig = {
    sqlConfiguration: configuration,
    mappingConfiguration: [
        { type: 'Parts', columns: ['Id', 'Name_LOC'], identityColumn: 'Id', index: 'parts'},
        { type: 'Calculations', columns: ['Id', 'Name_LOC', 'Guid'], identityColumn: 'Id', index: 'caluclations'},
    ]
}

indices.deleteAll()
    .then(async () => {
        updateConfig.mappingConfiguration.map(m => m.index).forEach(idx => {
            await indices.createIndex(idx);
        });
    })
    .then(async () => await sync.updateBulk(updateConfig))
    .then(async () => {
        await sleep(2000);
        const result = await search.search(indexName, 'Parts', 'Klein*');
        result.hits.hits.forEach(hit => {
            console.log(hit);
        });
    })
    .then(() => {
        console.log('DONE');
    })
    .catch(error => {
        console.log(error);
    });