const {mountWorker, Worker} = require('lib/')
const moment = require('moment')

class ExampleName extends Worker{
    static get workerName(){
        return 'exampleWorkerName'
    }
    
    /**********************************************
     ** Requirements
     **     props
     **         organizationID 
     **         week
     **     Fetch
     **         Resources
     **   
     **********************************************/
    async work(){
      
    }
}

module.exports = mountWorker(ExampleName)