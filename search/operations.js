const client = require('./connect');
const _ = require('lodash');
const { asyncForEach } = require('../utils/utils');

const addIndex = async (index, type, id, body) => {
    return await client.index({
        index,
        type,
        id,
        body,
   });
};

const deleteIndex = async (index, type, ids) => {
    return await client.delete({
        index,
        type,
        id,
    });
};

const deleteBulk = async (index, type, ids) => {
    return await asyncForEach(ids, async (id) => {
        return await deleteIndex(index, type, id);
    });
};

const indexBulk = async (index, type, data, identityKey) => {
    const createHeader = key => ({
        index: { 
            _index: index,
            _type: type, 
            _id: key,
        }
    });
    
    const createBody = d => {
        return d;
    };

    const body = _.flatMap(data, d => [createHeader(d[identityKey]), createBody(d)])
    
    return await client.bulk({
        body,
    });
};

module.exports = {
    addIndex,
    deleteIndex,
    indexBulk,
    deleteBulk,
};