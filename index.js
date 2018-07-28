const indices = require('./search/indices');
const data = require('./search/operations');
const search = require('./search/search');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

const exists = indices.exists('parts').then(result=> {
    console.log(result);
    return result;
}).then(async res => {
    if (res) {
        await indices.deleteIndex('parts')
    }
}).then(res => {
    indices.createIndex('parts');
}).then(async res => {
    /*
    await data.add('parts', 'Parts', 1, {
        name: 'Bauteil1',
        comment: 'This is a good part',
    });
    await data.add('parts', 'Parts', 2, {
        name: 'Bauteil2',
        comment: 'This is a bad part',
    });*/
    const rows = [
        {
            id: 1,
            name: 'Bauteil1',
            comment: 'This is a good part',
        },{
            id: 2,
            name: 'Bauteil2',
            comment: 'This is a bad part',
        }
    ];

    await data.indexBulk('parts', 'Parts', rows)
    await sleep(1000);
}).then(async res => {
    const result = await search.search('parts', 'Parts', 'Bauteil*');
    result.hits.hits.forEach(hit => {
        console.log(hit);
      });
}).catch(error => {
    console.log(error);
});