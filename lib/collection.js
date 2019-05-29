const collection = (path)=>({
    get: ()=>{
        return redis.json.get(path)
    },
    set: (key, value)=>{
        const data = (await redis.json.get(path)) || {}
        data[key] = value 
        
        return redis.json.set(path, data)
    }
})

module.exports = collection