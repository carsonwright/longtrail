const Model = require('lib/model');

class ExampleName extends Model {
    static get tableName(){
        return 'exampleTableName';
    }
}
module.exports = ExampleName