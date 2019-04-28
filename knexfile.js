const {database} = require('./config');

module.exports = Object.keys(database).reduce((environments, key)=>{
  environments[key].seeds = {
    directory: __dirname+"/db/migrations",
  }
  environments[key].migrations = {
    directory: __dirname+"/db/migrations",
    tableName: "migrationHistory"
  }
  
  return environments
}, database)
