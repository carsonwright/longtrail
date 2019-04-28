const Migration = require('../Migration')

class createAccounts extends Migration {
    async up () {
        return this.createTable('accounts', (t)=>{
            t.string('encryptedPassword');

            t.string('firstName');
            t.string('middleInitial');
            t.string('lastName');

            t.timestamp('birthday');
            
            t.string('unit'),
            t.string('zip')
            t.string('address');
            t.string('city');
            t.string('county');
            t.string('state'),
            t.string('country');
        });
    }
    async down () {
        return this.dropTable('accounts')
    }
}

module.exports = createAccounts.migration()