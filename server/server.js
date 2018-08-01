const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');

const search = require('../search/search');
const status = require('../search/status');
const sync = require('../sync/synchronizer');
const indices = require('../search/indices');
const { asyncForEach } = require('../utils/utils')

const app = express();
app.use(bodyParser.json());

app.use((err, req, res, next) => {
    res.status(500);
    res.send('Internal server error');
});

app.post('/sync', async (req, res) => {
    const { mappingConfiguration } = req.body;
    const sqlConfiguration = config.get('DatabaseConfig');

    const updateConfig = {
        sqlConfiguration,
        mappingConfiguration,
    };

    await indices
        .deleteAll()
        .then(async () => {
            await asyncForEach(updateConfig.mappingConfiguration.map(m => m.index), async idx => {
                await indices.createIndex(idx);
            });
        })
        .then(async () => await sync.updateBulk(updateConfig))
        .then(() => {
            res.json(true);
            res.status(200);
        });
});

app.post('/update', async (req, res) => {
    const { index, type, identityColumn, data } = req.body;
    await sync.update(index, type, identityColumn, data);
    res.json(true);
    res.status(200);
});

app.post('/search', async (req, res) => {
    const { indexName, type, searchString } = req.body;
    const result = await search.search(indexName, type, searchString);
    res.json(result);
    res.status(200);
});

app.get('/status', async (req, res) => {
    const result = await status.isElasticSearchRunning();
    res.json(result);
    res.status(200);
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});