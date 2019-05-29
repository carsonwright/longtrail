const Model = require('lib/model')

class Company extends Model {
    static get tableName(){
        return 'companies'
    }
    get tests(){
        return this.hasMany('Test')
    }
}


module.exports = Company;