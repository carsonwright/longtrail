const config = require('config')
const Redis = require('ioredis');
const redis = new Redis(config.redis);

class Store {
    constructor(tableName){
        this.tableName = tableName
    }
    async set(key, value){
        return await this.constructor.set(`${this.tableName}${key}`, value)   
    }
    async get(key, value){
        this.constructor.set(`${this.tableName}${key}`, value)   

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
}

module.exports = Store;