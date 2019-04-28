const Knex = require('knex');
const {database} = require('../../config');
const config = require('../../config')

module.exports = ()=>{
    const knex = Knex({
        ...database[config.env],
        asyncStackTraces: true
    })
    return knex; 
}
