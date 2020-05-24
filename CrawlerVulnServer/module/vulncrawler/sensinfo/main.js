const path = require('path');
const { Worker } = require('worker_threads');

class WorkerPool {
    _workers = [];                    // 线程引用数组
    _activeWorkers = [];              // 激活的线程数组
    _queue = [];                      // 任务队列

    constructor(workerPath, numOfThreads) {
        this.workerPath = workerPath;
        this.numOfThreads = numOfThreads;
        this.init();
    }

    // 初始化多线程
    init() {
        if (this.numOfThreads < 1) {
            throw new Error('线程池最小线程数应为1');
        }

        for (let i = 0;i < this.numOfThreads; i++) {
            const worker = new Worker(this.workerPath);

            this._workers[i] = worker;
            this._activeWorkers[i] = false;
        }
    }

    // 结束线程池中所有线程
    destroy() {
        for (let i = 0; i < this.numOfThreads; i++) {
            if (this._activeWorkers[i]) {
                throw new Error(`${i}号线程仍在工作中...`);
            }
            this._workers[i].terminate();
        }
    }

    // 检查是否有空闲worker
    checkWorkers() {
        for (let i = 0; i < this.numOfThreads; i++) {
            if (!this._activeWorkers[i]) {
                return i;
            }
        }

        return -1;
    }

    run(getData) {
        return new Promise((resolve, reject) => {
            const restWorkerId = this.checkWorkers();

            const queueItem = {
                getData,
                callback: (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(result);
                }
            }

            // 线程池已满,将任务加入任务队列
            if (restWorkerId === -1) {
                this._queue.push(queueItem);
                return null;
            }

            // 空闲线程执行任务
            this.runWorker(restWorkerId, queueItem);
        })
    }

    async runWorker(workerId, queueItem) {
        const worker = this._workers[workerId];
        this._activeWorkers[workerId] = true;

        // 线程结果回调
        const messageCallback = (result) => {
            queueItem.callback(null, result);
            cleanUp();
        };

        // 线程错误回调
        const errorCallback = (error) => {
            queueItem.callback(error);
            cleanUp();
        };

        // 任务结束消除旧监听器,若还有待完成任务,继续完成
        const cleanUp = () => {
            worker.removeAllListeners('message');
            worker.removeAllListeners('error');

            this._activeWorkers[workerId] = false;

            if (!this._queue.length) {
                return null;
            }

            this.runWorker(workerId, this._queue.shift());
        }

        // 线程创建监听结果/错误回调
        worker.once('message', messageCallback);
        worker.once('error', errorCallback);
        // 向子线程传递初始data
        worker.postMessage(queueItem.getData);
    }
}
module.exports=WorkerPool