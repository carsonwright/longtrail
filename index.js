require('app-module-path').addPath(__dirname);
const routes = require('config/routes')
const config = require('config')
const EventEmitter = require( "events" );  
EventEmitter.defaultMaxListeners = 23;

if(config.state.scheduling){
    const logger = require('lib/logger');
    const http = require('http');


    if(config.hipaa){
        logger.info({key: 'HIPAA', message: "STARTING WITH HIPAA "})
    }else{
        logger.info({key: 'NONHIPAA', message: "STARTING NOT WITH HIPAA"})
    }

    const server = http.createServer(async(req, res)=>{
        res.send = (data)=>{
            res.end(data ? JSON.stringify(data, null, 4) : '');
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'x-token, Origin, X-Requested-With, Content-Type, Accept, x-organization-id');

        if(req.method.toLocaleLowerCase() === 'options'){
            res.end()
        }else{
            routes.lookup(req, res)
        }
    });

    console.log(`Server running on port localhost:${config.server.port}`);
    server.listen(config.server.port);
}else{
    require('./src')
}