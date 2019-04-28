module.exports = (context)=>{
    context.findBy = async (...options)=>{
        const [item] = await context.where(...options).limit(1)

        return item;
    }
    context.findByOrCreate = async(...options)=>{
        const test = await context.findBy(...options)
        if(test){
            return test
        }else{
            return await context.create(...options)
        }
    }

    context.findByAndUpdateOrCreate = async(query, params)=>{
        const test = await context.findBy(query)

        if(test){
            return test.update(params)
        }else{
            return await context.create(params)
        }
    }
    
    return context
}