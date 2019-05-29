const config = require('config')
const moment = require('moment')
const Queue = require('bee-queue')
const logger = require('lib/logger')
const processorKeyss = {}
class Driver{
    constructor(processorKeys, processor){
        if(!this.constructor.processors[processorKeys]){
            const opts = {
                redis: config.redis,
                activateDelayedJobs: true
            }

            this.bee = new Queue(processorKeys, opts)
            this.constructor.processors[processorKeys] = this.bee 
        }else{
            this.bee = this.constructor.processors[processorKeys]
        }
        this.processorKeys = processorKeys
        this.processor = processor

        if(processor){
            try{
                
                if(!processorKeys){
                    console.log(processor)
                }

                if(processorKeyss[processorKeys]){
                    logger.error({
                        type: ['error'], message: processor.processorKeys || processor.processorKey
                    })
                    return 'error'
                }else{
                    processorKeyss[processorKeys] = true
                }
                const process = async(job, done)=>{
                    try{
                        const props = Object(job.data)
                        const options = Object(job.data)._options
                        delete props._options
                        delete props.processorKeys
                        const _processor = new processor(props, options)
                        
                        _processor.props = _processor.props || props;
                        _processor.job = job;
                        _processor._done = done
                        _processor._options = options
                        const work = _processor.execute()
                        if(work.then){
                            await work
                            return done()
                        }
                        console.log("DONE")
                    }catch(error){
                        logger.error({
                            type: ['error'], message: error
                        })
                    }
                }

                this.bee.on('ready', () => {
                    processor.isMounted = true
                    
                    if(processor.processorsDidMount) processor.processorsDidMount()
                });
                this.bee.on('failed', (job, error) => {
                    if(processor.processorDidFail) processor.processorDidFail({
                        props: job.data,
                        job,
                        error
                    })
                });
                this.bee.on('error', (error) => {
                    if(processor.processorDidError) processor.processorDidError({
                        error
                    })
                });
                this.bee.on('succeeded', (job, result) => {
                    if(processor.processorDidSucceed) processor.processorDidSucceed({
                        props: job.data,
                        job,
                        result
                    })
                });
                this.bee.on('retrying', (job, error) => {
                    if(processor.processorWillRetry) processor.processorWillRetry({
                        props: job.data,
                        job,
                        error
                    })
                });
                this.bee.on('stalled', async(jobID) => {
                    if(processor.processorDidStall) {
                        let job
                        try{
                            job = await this.bee.getJob(jobID);
                        }catch(error){
                            console.log(`Couldn't get Job ${jobID}`)
                        }
                        processor.processorDidStall({
                            props: job.data,
                            job
                        })
                    }
                });
                if(processor.concurrency){
                    this.bee.process(processor.concurrency, process)
                }else{
                    this.bee.process(process)
                }
            }catch(error){
                // logger.error({type: [this.processor.name], message: error.stack})
            }
        }
    }
    async dispatch(data={}, options = {}){
        return new Promise(async(resolve, reject)=>{
            try{
                data._options = options
                const job = this.bee.createJob(data);

                if(options.delay){
                    const next = moment().tz('ETC/GMT').add(options.delay, 'milliseconds').format()
                    
                    job.delayUntil(
                        Date.parse(next)
                    )
                }


                const j = job.retries(2)
                .save()

                job.on('succeeded', (result)=>{
                    resolve({
                        result,
                        job
                    });
                });

                job.on('failed', reject);
            }catch(error){
                reject(error)
            }
        })
    }
}
Driver.processors = {};
Driver.finished={};

module.exports = Driver