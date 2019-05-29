var url  = require('url');
const logger = require('lib/logger')

class Controller{
    constructor(req, res, params, action){
        this.req = req;
        this.res = res;
        this.params = params || {};
        this.action = action;
        
        this.url = url.parse(req.url, {parseQueryString: true})
        

        this.params = {
            ...this.params,
            ...(this.url.query || {})
        }
    }
    render(response, options = {}){
        if(typeof response !== 'string'){
            options = response
        }

        if(options.status) res.statusCode = options.status
        if(options.json){
            response = JSON.stringify(options.json)
            this.res.setHeader('Content-Type', 'application/json');
        } 
        

        return this.res.end(response)
    }

    index(){
        console.log('Index action needs to be filled out')
    }
    
    show(){
        console.log('Show action needs to be filled out')
    }
    
    create(){
        console.log('Create action needs to be filled out')
    }
    
    update(){
        console.log('Update action needs to be filled out')
    }
    
    destroy(){
        console.log('Destroy action needs to be filled out')
    }
}


module.exports = Controller