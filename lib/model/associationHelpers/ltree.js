


module.exports = (context)=>{
    context.ltree = {
        has: (id)=>{
            id = id.replace(/-/g, '_')
            return context.where(`${context._Model.tableName}.path`, '~', `*.${id}.*`)
        },
        top: (id)=>{
            id = id.replace(/-/g, '_')
            return context.where(`${context._Model.tableName}.path`, '<@', id)
        },
        bottom: (id)=>{
            id = id.replace(/-/g, '_')
            return context.where(`${context._Model.tableName}.path`, '@>', id)
        }
    }

    return context;
}