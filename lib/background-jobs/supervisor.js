const config = require('config')
const Processor = require('./processor')
const uuid = require('uuid').v4;
const redis = require('lib/redis')
const logger = require('lib/logger')
const stackTrace = require('stack-trace')
const moment = require('moment')

class Supervisor extends Processor {
    constructor(props){
        super(props)
    }
    get seriesKey(){
        return this.constructor.processorKey
    }
    process(){

    }
    async execute(){
        let life = this.startLife()

        const frame = stackTrace.get()[1]
        const fileName = `${frame.getFileName()}:${frame.getLineNumber()}`;
        try{
            await this.process()
        }catch(error){
            logger.error({
                type: ['Supervisor', this.processorKey],
                message: error.stack
            })
        }
        
        try{
            let status = await this.status.get()
            if(this.props.uuid == status.uuid){
                for(let [i, worker] of this.workers.entries()){
                    let props;
    
                    this.setProgress(i, this.workers.length)
                    if(worker.name == this.action){
                        if(this.workers.length - 1 == i) {
                            i = 0
                        }else if(this.workers.length > 1) i++
                        
                        const nextWorker = this.workers[i]
                        if(this.constructor.name == nextWorker.name || !this.props.loopCount){
                            props = {
                                stack: [(this.props.stack || []), fileName],
                                loopCount: (this.props.loopCount || 0) + 1
                            }
                        }

                        let resetSync = status.resetSync || {}
                        this.props.reset = resetSync[nextWorker.name]
                        resetSync[nextWorker.name] = ''
                        await this.status.set('resetSync', resetSync)

                        nextWorker.dispatch({
                            ...this.props,
                            supervisor: {
                                processorKey: this.constructor.processorKey
                            },
                            ...props,
                            action: nextWorker.name
                        }, {
                            delay: this.delay
                        })
                    }
                }   
            }
            clearInterval(life)
        }catch(error){
            logger.error({
                type: ['Supervisor', this.pocessorKey],
                message: error.stack
            })
        }
    }

    get action(){
        return this.props.action || (this.workers[this.workers.length - 1] || {}).name
    }

    get delay(){
        return this.props.delay || 10000
    }

    async isDead(){
        const seriesKey = this.seriesKey
        const check = await this.status.get()
        
        if(Object(check).uuid){
            const lastPingAgo = moment.duration(this.now - check.ping, 'milliseconds').asMinutes()
            if(lastPingAgo > 2){
                await redis.del(seriesKey)
                return true
            }
            return false
        }
        return true
    }

    static start(props = {}){
        const frame = stackTrace.get()[1]
        const fileName = `${frame.getFileName()}:${frame.getLineNumber()}`;

        return (async()=>{

            if(!this.processorKey){
                throw new Error('Processor Key must be defined')
            }
            const instance = new this(props)
            const seriesKey = instance.seriesKey

            if(await instance.isDead()){
                const _uuid = uuid()

                let resetSync = {}
                for(let worker of instance.workers){
                    resetSync[worker.name] = ''
                }
 
                await instance.status.set({
                    uuid: _uuid,
                    ping: this.now,
                    resetSync
                })
                instance.uuid = _uuid
                const _check = await redis.json.get(seriesKey)
                
                if(_check.uuid == _uuid){
                    this.dispatch({
                        stack: [fileName],
                        uuid: _uuid,
                        loopCount: 0,
                        ...props
                    })
                }
            }

        })()
    }
}



module.exports = Supervisor


class Example extends Supervisor{
    get seriesKey(){
        return `${this.props.organizationID}-your-thing`
    }

    get startingAction(){
        return 'YourThing'
    }

    get workers(){
        return [
            YourThing,
            YourOtherThing,
            Example // To repeat
        ]
    }

}

Supervisor.Example = Example.toString()