const config = require('../../config')
const Driver = require('./driver')
const redis = require('lib/redis')
const logger = require('lib/logger')
const stackTrace = require('stack-trace')

const os = require('os')

class Processor {
    constructor(props){
        this.props = {
            ...(props || {})
        }

        if(this.props.stack && Array.isArray(this.props.stack) && this.props.stack.length > 7){
            this.props.stack = this.props.stack.slice(
                this.props.stack.length - 7, this.props.stack.length
            )
        }

        this.state = {}
    }

    get seriesKey(){
        return this.constructor.processorKey
    }
    
    static throwError(message){
        throw new Error(message)
    }

    static shouldMount(){
        const isHost = os.hostname().includes('worker')
        const isWorkers = config.state.workers

        if(isWorkers && (isHost || config.state.isDevelopment)){
            return true
        }
    }

    get fileName(){
        return this.constructor.fileName
    }
    static get fileName(){
        return Processor.mounted[this.processorKey].fileName
    }
    static processorDidMount(){
        
    }
    onComplete(){
        
    }
    static mount(){
        (async()=>{
            const error = new Error()
            if(await this.shouldMount()){
                
                if(this.processorKey && !Processor.mounted.keys.includes(this.processorKey)){
                    const frame = stackTrace.get()[1]
                    
                    new Driver(this.processorKey, this)
                    Processor.mounted.processors[this.processorKey] = {
                        Processor: this,
                        fileName: frame.getFileName()
                    }
                    Processor.mounted.keys.push(this.processorKey)
                    this.processorDidMount()
                }else{
                    error.message = `${this.name} does not have a processorKey`
                    throw error
                }
            }
        })()
        
        return this;
    }
    
    concurrency(){
        return 10
    }

    done(){
        this._done()
    }

    get redis(){
        return redis
    }

    setProgress(current, total){
        let value;
        if(current !== 0){
            value = (current / total) * 100
        }else{
            value = 0
        }

        if(!typeof current == 'number'){
            throw new Error(`Progress current value must be a number`)
        }

        if(!typeof total == 'number'){
            throw new Error(`Progress total must be a number`)
        }

        if(value > 100){
            throw new Error(`Progress current must be below 100 value was ${value}`)
        }

        if(value < 0){
            throw new Error(`Progress current must be above 0 value was ${value}`)
        }
        
        this.job.reportProgress(Math.round(value))
    }


    get now(){
        return this.constructor.now
    }

    static get now(){
        return (new Date()).getTime()
    }

    async execute(){
        let life;
        try{
            life = this.startLife()
            
            await this.process()
         }catch(error){
            logger.error({type: ['Worker', this.processorKey], message: error.stack})
        }

        try{
            this.onComplete()
        }catch(error){
            logger.error({type: ['Worker', this.processorKey], message: error.stack})
        }

        clearInterval(life)
        return true;
    }

    get ping(){
        return {
            get: async ()=>{
                return (
                    (
                        await this.status.get()
                    ) || {}
                ).ping
            },
            set: async ()=>{
                return await this.status.set("ping", this.now)
            }
        }
    }

    async startLife (){
        const check = this.status.get()

        if(check.seriesKey == this.props.seriesKey){
            return setInterval(this.ping.set, 30000)
        }
    }

    static dispatch(data = {}, options = {}){
        const frame = stackTrace.get()[1]
        const fileName = `${frame.getFileName()}:${frame.getLineNumber()}`;

        data.stack = [...(data.stack || []), fileName]
        const driver = new Driver(this.processorKey)
        
        return driver.dispatch(data, options)
    }
   
    get status (){
        return {
            get: async()=>{
                return (await redis.json.get(this.seriesKey)) || {}
            },
            set: async(key, value)=>{
                let values;
                if(value){
                    values = await this.status.get()
                    values[key] = value
                }else{
                    values = key
                }

                return await redis.json.set(this.seriesKey, values)
            }
        }
    }


    async each(values, cb){
        values = Array(values)
        for(let [i, v] of values.entries()){
            i++
            await cb(v, i)
            this.setProgress(i, values.length)
        }
    }

    static prepare(_props, _options = {}){
        const name = this.name
        return class extends this {
            static get name(){
                return name
            }
            static dispatch(props, options = {}){
                super.dispatch({
                    ..._props,
                    props
                }, {..._options, ...options})
            }
            static start(props, options = {}){
                super.start({
                    ..._props,
                    props
                }, {
                    ..._options,
                    ...options
                })
            }
        }
    }

    get(key){
        return this.redis.json.get(`${this.processorKey}:${key}`)
    }

    set(key, data){
        return this.redis.json.set(`${this.processorKey}:${key}`, data)
    }
}

Processor.mounted = {
    processors: {},
    keys: []
}

module.exports = Processor