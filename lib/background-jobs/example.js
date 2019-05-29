const {mountWorker, Worker} = require('lib/background-jobs')
const moment = require('moment')

class ExampleName extends Worker{
    static get processorKey(){
        return 'exampleprocessorKey'
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