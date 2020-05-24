const WorkerPool=require('./main');
const path=require('path');
const pool = new WorkerPool(path.join(__dirname, 'worker.js'), 10);

const items = [...new Array(10)].fill(null);

Promise.all(items.map(async (_, i) => {
    const res = await pool.run();

    console.log(`任务${i}完成结果:`, res);
})).then(() => {
    console.log('所有任务完成 !');
    // 销毁线程池
    pool.destroy();
});