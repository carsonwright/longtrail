const development = require('./development')
const staging = require('./staging')
const production = require('./production')
const test = require('./test')

module.exports = {
    development,
    staging,
    test,
    production
}
