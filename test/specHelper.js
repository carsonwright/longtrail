const path = require('path')
require('app-module-path').addPath(path.join(__dirname, '../'));

const mock = require('mock-require');

mock('bcrypt', { 
    genSalt: async ()=>{ return},
    hash: async (_hash)=>{ return _hash},
    compare: async (a, b)=>{return a === b}
});

class Queue {
    constructor(queueName){
        this._queueName = queueName
        this.constructor.queues[this._queueName] = this.constructor.queues[this._queueName] || {}
    }
    process (handler) {
        if (this.constructor.queues[this._queueName].handler) 
            throw Error("Cannot define a handler more than once per Queue instance");
        
        this.constructor.queues[this._queueName].handler = handler;
        this.constructor.queues[this._queueName].events = [];
    }
    async add (data) {
        const job = this.createJob(data);
        
        if (!this.constructor.queues[this._queueName].handler) 
            throw Error("Mocking version requires handler to be set before first add()");
    
        this.constructor.queues[this._queueName].events.push(data);
        await this.constructor.queues[this._queueName].handler(job, this.done);

    }
    done () {

    }
    
    createJob (data) {
        return {
            progress: (value)=>{
                Queue.queues[this._queueName].progress = value;
            },
            'data': data
        };
    }
}
Queue.queues = {}
class Redis {
    set(key, value){
        this.constructor.data[key] = value
    }
    get(key, cb){
        cb(false, this.constructor.data[key])
    }
}
Redis.data = {}
//mock('redisio', );
const plivo = {}
class PlivoClient {
    get messages (){
        return class{
            static async create(source, mobilePhone, body){
                return plivo.messages.push({
                    source,
                    mobilePhone,
                    body
                })
            }
        }
    }
}
plivo.Client = PlivoClient
plivo.messages = []

mock('plivo', plivo);

const mailgun = ()=>({
    messages: ()=>({
        send: (options, cb)=>{
            mailgun.messages.push(options)
            cb()
        }
    })
});

mailgun.messages = [];


mock('mailgun-js', mailgun);
mock('bull', Queue);

const test = require('ava');
const knexMigrate = require('knex-migrate');
const db = require('lib/db');
const knex = db();
const app = require('./app');
const logger = require('lib/logger');

let tables;
test.before(async ()=>{
    tables = await knex('pg_catalog.pg_tables')
    .select('tablename')
    .where({schemaname: 'public'})
    
    tables = tables.filter(({tablename})=> 
        !['migrationHistory', 'migrationHistory_lock'].includes(tablename)
    )
    
    return await knexMigrate('up', {})
})
test.after(async ()=>{
    return await app.writeSpec()
})

test.beforeEach(async ()=> {
    let sql = '';
    for(let {tablename} of tables){
        await knex(tablename).del()
    //    sql += `delete from "${tablename}";`
        
    }
    
    //await knex.raw(sql)

    return true
})
test.afterEach(async()=>{
    return await knex.schema.raw('ROLLBACK')
})
test.app = app;

test.json = (value)=>(
    JSON.stringify(value, null, 4)
)

module.exports = test;