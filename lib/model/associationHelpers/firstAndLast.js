module.exports = (context)=>{
    context.first = async (options)=>{
        const values = await context.all().orderBy('createdAt', 'ASC').limit(options || 1);

        if(!options){
            return values[0];
        }else{
            return values;
        }
    }
    context.last = async (options)=>{
        const values = await context.all().orderBy('createdAt', 'desc').limit(options || 1)

        if(!options){
            return values[0];
        }else{
            return values;
        }
    }

    return context
}