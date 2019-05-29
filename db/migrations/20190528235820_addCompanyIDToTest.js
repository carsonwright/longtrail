const Migration = require('../Migration')

class addCompanyIDToTest extends Migration {
    async up () {
        await this.addColumn('tests', 'companyID', 'uuid')
    }
    async down () {
        await this.dropColumn('tests', 'companyID')
    }
}

module.exports = addCompanyIDToTest.migration()