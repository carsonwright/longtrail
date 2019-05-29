const config = require('config')
const _ = require('lodash')
const {RedisClient} = require('redis')
const asyncRedis = require('async-redis')
const createClient = require('./createClient')

class Redis extends RedisClient {
    set(key, value){
        if(!key) throw new Error('Key must not be undefined')
        if(!value) throw new Error('Value must not be undefined')

        return super.set(key, value)
    }

    get(key){
        if(!key) throw new Error('Key must not be undefined')

        return new Promise((resolve, reject)=>{
            
            super.get(key, (err,data)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(data)
                }
            })
        })
    }

    get json(){
        return {
            set: (key, value)=>{
                return this.set(key, JSON.stringify(value))
            },
            get: async(key)=>{
                if(!key) throw new Error('Key must not be undefined')
                const value = await this.get(key)

                return JSON.parse(value)
            }
        }
    }

}

module.exports = asyncRedis.decorate(
    new Redis(createClient(config.redis))
)