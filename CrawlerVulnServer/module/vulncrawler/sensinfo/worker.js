const { isMainThread, parentPort } = require('worker_threads');

if (isMainThread) {
    throw new Error('Its not a worker');
}

const doCalcs = (data) => {
    const collection = [];

    for (let i = 0; i < 10; i++) {
        collection[i] = Math.round(Math.random() * 1000);
    }

    return collection.sort((a, b) => { return a - b });
};

parentPort.on('message', (data) => {
    const result = doCalcs(data);
    parentPort.postMessage(result);
});