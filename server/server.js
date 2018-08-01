const express = require('express');
const bodyParser = require('body-parser');

const search = require('../search/search');
const sync = require('../sync/synchronizer');

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

    await sync.updateBulk(updateConfig);
    res.status(200);
});

app.post('/search', async (req, res) => {
    const { indexName, type, searchString } = req.body;
    const result = await search.search(indexName, type, searchString);
    res.json(result);
    res.status(200);
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});