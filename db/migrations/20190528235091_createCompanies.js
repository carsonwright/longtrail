const Migration = require('../Migration')

class createCompanies extends Migration {
    async up () {
        await this.createTable('companies', (t)=>{
            t.string('name')
            t.text('description')
            t.string('url')
        })
    }
    async down () {
        await this.dropTable('companies')
    }
}

module.exports = createCompanies.migration()