const client = require('./connect');

const mapToResult = queryResult => {
    const { hits } = queryResult;
    return hits.hits.map(hit => ({
        id: hit._id,
        type: hit._type,
        score: hit._score,
        data: hit._source,
    }));
};

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

    return mapToResult(result);
};

const searchByField = async (index, type, field, values) => {
    const filter = {};
    filter[field] = values;
    const result = await client.search({
        index,
        type,
        body: {
            query: {
                constant_score: {
                    filter: {
                        terms: filter,
                    },
                },
            },
        },
    });

    return mapToResult(result);
};

module.exports = {
    search,
    searchByField,
};