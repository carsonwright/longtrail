const Migration = require('../Migration')

class addLTree extends Migration {
    async up () {
        return await this.knex.raw('create extension ltree')
    }
    async down () {
        return await this.knex.raw('drop extension ltree')
    }
}

module.exports = addLTree.migration()