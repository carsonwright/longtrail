const Model = require('lib/model')

class Test extends Model {
    static get tableName(){
        return 'tests'
    }
    get company(){
        return this.belongsTo('Company')
    }
}


module.exports = Test;