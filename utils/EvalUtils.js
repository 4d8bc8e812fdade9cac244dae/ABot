const { Worker } = require('worker_threads')

module.exports = class Runner {
    constructor(code) {
        this.code = code
    }

    execute() {
        return new Promise((resolve, reject) => {
            let worker = new Worker(`const { parentPort } = require('worker_threads')
const ivm = require('isolated-vm')
const isolate = new ivm.Isolate({memoryLimit: 64, onCatastrophicError: () => {}})
const context = isolate.createContextSync()
            
context.eval(${JSON.stringify(this.code)}, {timeout: 5000}).then(result => {
    parentPort.postMessage({result: result})
}).catch(error => {
    parentPort.postMessage({error: error.message})
})`, {
                resourceLimits: {
                    codeRangeSizeMb: 16,
                    stackSizeMb: 8
                },
                eval: true,
            })

            const timeout = 10 * 1000

            setTimeout(() => {
                if (worker) {
                    try {
                        worker.terminate()
                        worker.emit('error', new Error(`Script execution timed out.`))
                    } catch {}
                }
            }, timeout)

            worker.on('message', (message) => {
                if (message.error) {
                    reject(new Error(message.error))
                    worker = undefined
                } else {
                    resolve(message.result)
                    worker = undefined
                }
            })

            worker.on('error', (e) => {
                reject(e)
                worker = undefined
            })
            worker.on('messageerror', (e) => {
                reject(e)
                worker = undefined
            })

            worker.on('exit', (code) => {
                if (code !== 0) {
                    reject(new Error(`Worker stopped with exit code ${code}`))
                    worker = undefined
                }
            })
        })
    }
}