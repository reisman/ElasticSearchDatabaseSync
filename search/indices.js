const client = require('./connect');

const createIndex = async name => {
    return await client.indices.create({
        index: name,
    });
};


const exists = async name => {
    return await client.indices.exists({
        index: name,
    });
};

const deleteIndex = async name => {
    return await client.indices.delete({
        index: name,
    });
};

module.exports = {
    createIndex,
    deleteIndex,
    exists,
};