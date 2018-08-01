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

const deleteAll = async () => {
    await client.indices.delete({
        index: '_all'
    });

    /*
    await client.cat.indices({
        h : ['index']
      }).then(idx => {
          delete(idx);
      })
      */
    //const idxs = await client.indices.get({});
    //await client.indices.delete({});
};

module.exports = {
    createIndex,
    deleteIndex,
    exists,
    deleteAll,
};