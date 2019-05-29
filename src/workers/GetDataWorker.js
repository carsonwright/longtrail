const {Supervisor} = require('lib/background-jobs')

const GetsData = require('./GetData')
const GetsTop = require('./GetTop')
const GetsBottom = require('./GetBottom')
const GetsAverage = require('./GetAverage')
const SaveData = require('./SaveData')

class ProbabilitySupervisor extends Supervisor {

    workers(){
        return [
            GetsData,
            GetsTop,
            GetsBottom,
            GetsAverage,
            SaveData,
            ProbabilitySupervisor
        ]
    }
    async process(){
        console.log('Worker Ran')
        
    }
}

module.exports = ProbabilitySupervisor.mount()