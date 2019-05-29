const config = require('../config')
const redis = require('redis')
const redisClient = redis.createClient(config.redis)
const sub = redis.createClient(config.redis)
const _ = require('lodash')

let scope = ''
let level = 1
sub.on('message', (channel, message)=>{
    switch(channel){
        case 'scope':
            scope = message
            break;
        case 'level':
            level = Number(message)
            break;
    }
})

sub.subscribe('scope')
class Broker {
    static error(...args){
        console.error(...args)

        if(level > 1){
            this.publish('error', args)
        }
    }
    static warn(...args){
        console.warn(...args)

        if(level > 2){
            this.publish('warn', args)
        }
    }

    static info(...args){
        console.info(...args)
        if(level > 3){
            this.publish('info', args)
        }
    }

    static debug(...args){
        console.log(...args)

        if(level > 4){
            this.publish('debug', args)
        }
    }

    static log(...args){
        this.info(...args)
    }

    
    
    static publish(key, args){
        const value = JSON.stringify(args)
        
        redisClient.publish(key, value)
    }
}


module.exports = Broker;