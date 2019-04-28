const { Client } = require('pg')
const client = new Client()
const {database} = require('../../config');

(async()=>{
    try{
        const dbName = database.development.connection.database;
        
        await client.connect()
        await client.query(`CREATE DATABASE "${dbName}"`) 
    
        console.log(`Finished creating database ${dbName}`);
        return await client.end()
    }catch(error){
        console.error('Unable to Create Database!')
        console.error(error.message)
        process.exit(1)
    }
})()
