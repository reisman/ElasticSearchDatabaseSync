const elastic = require('elasticsearch');

const host = 'localhost:9200';
const log = 'trace';

const client = new elastic.Client({
    host,
    log,
});

module.exports = client;