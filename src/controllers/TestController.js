const Controller = require('lib/controller')
const {Test} = require('src/models');
const logger = require('lib/logger')
const exampleParams = require('src/params/example')

class TestController extends Controller {
    async index(){
        this.render({
            json: await Test.create(exampleParams(this.params))
        })
    }
    
    async show(){
        this.render(`hello world ${this.params.id}`)
    }

    async create(){
    }

    async update(){
        this.render({
            json: await Test.update({id: this.params.id})
        })
    }
    
    async destroy(){
        this.render({
            json: await Test.destroy({id: this.params.id})
        })
    }
}

module.exports = TestController;