const Migration = require('../Migration')

class createTest extends Migration {
    async up () {
       await this.createTable('tests', (t)=>{
            t.string('name')
            t.text('description')
        })
    }
    async down () {
        await this.dropTable('tests')
    }
}

module.exports = createTest.migration()