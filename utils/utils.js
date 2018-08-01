const asyncForEach = async (array, action) => {
    for (let idx = 0; idx < array.length; idx++) {
        await action(array[idx])
    }
};

module.exports = {
    asyncForEach,
};