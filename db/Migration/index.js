class Migration {
    static up(knex, promise){
        const instance = new this()
        instance.knex = knex;
        instance.promise = promise;
        return instance.up();
    }
    static down(knex, promise){
        const instance = new this()
        instance.knex = knex;
        instance.promise = promise;
        return instance.down();
    }
    
    async createTable(tableName, cb){
        const exists = await this.hasTable(tableName)
            
        if (exists) {
            return false
        }else{
            return await this.knex.schema.createTable(tableName, (t)=>{
                t.uuid('id');
                t.specificType('path', 'ltree')
                t.boolean('archived').defaultTo(false);
                t.timestamp('createdAt');
                t.timestamp('updatedAt');
                cb(t)
            })
        }
    }
    
    async columnExists(tableName, columnName){
        const check = await this.knex.raw(`
            SELECT column_name
            FROM information_schema.columns 
            WHERE table_name='${tableName}' and column_name='${columnName}';
        `)
        return check.rowCount !== 0
    }

    async addColumn(tableName, columnName, type, defaultTo){
        const exists = await this.columnExists(tableName, columnName)

        if(!exists){
            return await this.knex.schema.table(tableName, (t)=>{
                let column;
                if(t[type]){
                    column = t[type](columnName)
                }else{
                    t.specificType(columnName, type)
                }
                
                if(defaultTo) column.defaultTo(defaultTo)
            })
        }else{
            return false
        }
    }
    async dropColumn(tableName, columnName){
        const exists = await this.columnExists(tableName, columnName)
        
        if(exists){
            return await this.knex.schema.table(tableName, (t)=>{
                t.dropColumn(columnName)
            })
        }else{
            return false
        }
    }
    async renameColumn(tableName, fromName, toName){
        const exists = await this.columnExists(tableName, fromName)

        if(exists){
            return await this.knex.schema.table(tableName, (t)=>{
                t.renameColumn(fromName, toName)
            })
        }else{
            return false
        }
    }
    async changeColumnDefault(tableName, name, type, defaultValue){
        const exists = await this.columnExists(tableName, name) 
        if(exists){
            return await this.knex.schema.alterTable(tableName, (t)=>{
                if(t[type]){
                    return t[type](name).defaultTo(defaultValue).alter()
                }else{
                    return t.specificType(name, type).defaultTo(defaultValue).alter()
                }
            })
        }else{
            return false
        }
    }
    async changeColumn(tableName, name, type){
        const exists = await this.columnExists(tableName, name)

        if(exists){
            return await this.knex.schema.alterTable(tableName, (t)=>{
                if(t[type]){
                    return t[type](name).alter()
                }else{
                    return t.specificType(name, type).alter()
                }
            })
        }else{
            return false
        }
    }
    hasTable(tableName){
        return this.knex.schema.hasTable(tableName)
    }
    async dropTable(tableName){
        const exists = await this.hasTable(tableName)
        if(exists){
            return await this.knex.schema.dropTable(tableName)
        }else{
            return false;
        }
    }
    renameTable(from, to){
        return this.knex.schema.renameTable(from, to)
    }
    now(){
        return this.knex.fn.now()
    }
    static migration(){
        return {
            up: (knex)=>{
                return this.up(knex)
            },
            down: (knex)=>{
                return this.down(knex)
            }
        }
    }
}

module.exports = Migration