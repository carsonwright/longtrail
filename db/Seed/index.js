const app = require('../../src');
const db = require('../../lib/db');
const knex = db();
const faker = require('faker');

class Seed {
    
    get knex(){
        return knex
    }    
    get app(){
        return app
    }   
    get models(){
        return this.app.models
    }     
    get faker(){
        return faker
    }    
    get fake(){
        return {
            email: ()=>{
                const [email] = faker.internet.email().split('@')
                const fakeEmail = (
                    process.env.TEST_EMAIL || 'test@example.io'
                ).replace('@', `+${email}@`)
            
                return fakeEmail;
            },
            firstName: ()=>(
                faker.name.firstName()
            ),
            lastName: ()=>(
                faker.name.lastName()
            )
        }
    }
    times(){
        const _times = []
        for(let i=0; i < 10; i++){
            _times.push(i)
        }
        return _times;
    }
}

module.exports = Seed