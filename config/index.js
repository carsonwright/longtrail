const database = require('./database')
const server = require('./server')
const logging = require('./logging')
const environments = require('./environments')

const hipaa = `${process.env.HIPAA}`.toLocaleLowerCase() === 'true'
const service = `${process.env.SERVICE}`.toLocaleLowerCase() !== 'false'

const workers = `${process.env.WORKERS}`.toLocaleLowerCase() !== 'false'
const scheduling = `${process.env.SCHEDULING}`.toLocaleLowerCase() !== 'false'
const repl = `${process.env.REPL}`.toLocaleLowerCase() !== 'false'
const state = {workers, scheduling}
const env = process.env.NODE_ENV || 'development'


module.exports = environments[env]({
    database,
    server,
    logging,
    hipaa,    
    service,
    state,
    repl,
    env
})