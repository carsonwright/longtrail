const Driver = require('./driver')
const logger = require('lib/logger')
const Processor = require('./processor');
const redis = require('lib/redis')
const uuid = require('uuid').v4
const _ = require('lodash')

class Worker extends Processor{
   
    static async start(props = {}, args){
        console.log("DUH PROPS")
        if(!this.processorKey){
            throw new Error('Processor Key must be defined')
        }
        const instance = new this(props)
        if(!instance.seriesKey){
            throw new Error('Series Key must be defined')
        }
        console.log("STARTING")
        const check = await redis.get(instance.seriesKey)

        if(Object(check).uuid){
            const lastPingAgo = moment.duration(this.now - check.timeout, 'milliseconds').asMinutes()
            if(lastPingAgo > 2){
                console.log('deleting loop')
                redis.del(instance.seriesKey)
            }
        }else{
            const _uuid = uuid()

            await instance.status.set({
                uuid: _uuid,
                ping: this.now
            })

            const _check = await instance.status.get()

            if(_check.uuid == _uuid){
                this.dispatch(props)
            }
        }
    }
    
    onComplete(){
        
        const processorKey = _.get(this, 'props.supervisor.processorKey');

        if(processorKey){
            const driver = new Driver(processorKey)
            const job = driver.dispatch({
                ...this.props
            })
    
    
            return job;
        }else{
            throw new Error('Worker Needs Supervisor Processor Key')
        }
    }
}

module.exports = Worker