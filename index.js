const indices = require('./search/indices');
const data = require('./search/operations');
const search = require('./search/search');
const sql = require('./database/sqlserver');
const config = require('config');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const configuration = config.get('DatabaseConfig');
const indexName = 'testindex';

indices
    .exists(indexName)
    .then(async exists => {
        if (exists) {
            await indices.deleteIndex(indexName);
        }
    })
    .then(() => {
        indices.createIndex(indexName);
    })
    .then(async () => {
        const buffer = [];
        await sql.executeStream(configuration, 'SELECT Id, Name_LOC FROM Parts', row => {
            buffer.push({
                id: row['Id'],
                name: row['Name_LOC'],
            });
        });
        return buffer;
    })
    .then(async rows => {
        data.indexBulk(indexName, 'Parts', rows);
        await sleep(1000);
    })
    .then(async () => {
        const result = await search.search(indexName, 'Parts', 'Klein*');
        result.hits.hits.forEach(hit => {
            console.log(hit);
        })
    })
    .catch(error => {
        console.log(error);
    });