module.exports = ()=>(
    new Promisifier()
)

class Promisifier {
    constructor(){
        this.promise = new Promise((_resolve, _reject)=>{
            this.resolve = _resolve
            this.reject = _reject
        })
    }
}