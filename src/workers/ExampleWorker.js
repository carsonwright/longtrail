const {Worker, mountWorker} = require('lib/worker')

class ExampleWorker extends Worker {
    async work(){
        console.log('Worker Ran')
    }
}

module.exports = mountWorker(ExampleWorker)