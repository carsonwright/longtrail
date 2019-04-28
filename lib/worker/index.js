const config = require('config')
var Redis = require('ioredis')
Redis.Promise = require('bluebird');

var client = new Redis(config.redis);
var subscriber = new Redis(config.redis);
const redis = new Redis(config.redis)
var Queue = require('bull');

let opts = {}
if(config.env == 'production'){
    opts = {
      createClient: (type) => {
        switch (type) {
          case 'client':
            return client;
          case 'subscriber':
            return subscriber;
          default:
            return redis;
        }
      }
    }
}

class Supervisor{
    constructor(workerName, worker){
        if(!this.constructor.workers[workerName]){
            this.bull = new Queue(workerName, opts)
            this.constructor.workers[workerName] = this.bull 
        }else{
            this.bull = this.constructor.workers[workerName]
        }
        if(worker){
            this.bull.process(async(job, done)=>{
                const props = job.data
                delete props.workerName
                const _worker = new worker(props)

                _worker.props = _worker.props || props;
                _worker.job = job;
                _worker._done = done
                const work = _worker.work()
                if(work.then){
                    await work
                    return done()
                }
            })
        }
    }
    async dispatch(data, options){
        return new Promise(async(resolve, reject)=>{
            try{
                const _ =  await this.bull.add(data, options)

                this.constructor.finished[`${this.workerName}${_.id}`] = this.constructor.finished[`${this.workerName}${_.id}`] || await _.finished()
                resolve(_)
            }catch(error){
                reject(error)
            }
        })
    }
}
Supervisor.workers = {};
Supervisor.finished={};
class Worker {
    constructor(props){
        if(props){
            this.props = props
        }
        this.state = {}
    }
    static mount(){
        new Supervisor(this.workerName, this)
        return this;
    }
    static async set(key, value){
        if(value instanceof Object){
            return redis.set(key, JSON.stringify(value))
        }else{
            throw Error(`${value} is not value an object, value must be an object!`)
        }
    }
    static get(key){
        return new Promise((resolve, reject)=>{
            redis.get(key, (err, result)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(JSON.parse(result))
                }
            })
        })
    }

    done(){
        this._done()
    }
    set(key = '', value){
        if(key instanceof Object){
            value = key
            key = ''
        }
        return this.constructor.set(`worker-${this.constructor.workerName}--${key}`, value)
    }

    get(key = ''){
        return this.constructor.get(`worker-${this.constructor.workerName}--${key}`)
    }

    setProgress(value){
        this.job.progress(value)
    }
    dispatch(data){
        const supervisor = new Supervisor(data.workerName)
        return supervisor.dispatch(data)
    }
    static dispatch(data, options){
        const supervisor = new Supervisor(this.workerName)
        return supervisor.dispatch(data, options)
    }
}

const mountWorker = (worker)=>{
    if(!worker.workerName){
        throw Error(`${worker.name} does not have a workerName use the following: \n static get workerName(){\nreturn 'yourWorkerNameHere'\n}`)
    }else{
        if(config.services.workers){
            return worker.mount()
        }
    }

    return worker
}

module.exports = {
    Worker,
    Supervisor,
    mountWorker
}