const client = require('./connect');

const isElasticSearchRunning = async () => {
    const health = await client.cluster.health({});
    return health.status;
};

module.exports = {
    isElasticSearchRunning,
};