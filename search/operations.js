const client = require('./connect');
const _ = require('lodash');

const add = async (index, type, id, body) => {
    return await client.index({
        index,
        type,
        id,
        body,
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
    add,
    indexBulk,
};