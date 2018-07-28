const client = require('./connect');

const search = async (index, type, keyword) => {
    return await client.search({
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
};

module.exports = {
    search,
};