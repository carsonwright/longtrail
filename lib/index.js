// const core = require('core')
// const config = require('config')

// module.exports = core(config)
const logger = require('./logger')
const model = require('./model')
const db = require('./db')
const config = require('../config')
const store = require('./store')


module.exports = {
    logger,
    model,
    db,
    config,
    store
}