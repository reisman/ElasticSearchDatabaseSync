const client = require('./connect');

const search = async (index, type, keyword) => {
    const result = await client.search({
        index,
        type,
        body: {
            query: {
                query_string: {
                    query: keyword,
                }
            },
        },
    });

    const { hits } = result;
    return hits.hits.map(hit => ({
        id: hit._id,
        type: hit._type,
        score: hit._score,
        data: hit._source,
    }));
};

module.exports = {
    search,
};