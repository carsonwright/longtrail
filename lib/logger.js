const config = require('../config')
const stackTrace = require('stack-trace')

const processMessage = (message)=>{
    if(Array.isArray(message)){
        message = message.map((_)=>{
            // if(typeof _ ==='object' && !message.constructor.name.includes('Error')){
            //     return JSON.stringify(_, null, 4)
            // }else{
                return _
            // }
        })
    }else if(typeof message == 'object' && !message.constructor.name.includes('Error')){
        // message = JSON.stringify(message, null, 4)
    }
    return message
}

const isValid = (type)=>{
    // if(config.logging.validtype[0] == '*'){
    //     return true
    // }
    // for(key of config.logging.invalidtype){
    //     if(type.includes(key)){
    //         return false
    //     }
    // }
    // for(key of config.logging.validtype){
    //     if(type.includes(key)){
    //         return true
    //     }
    // }
    return true
}

const getLineandNumber = (frame)=>{
    let cwd;
    if(!config.service){
        cwd = process.cwd().replace('/services/shark', '')
    }else{
        cwd = process.cwd()
    }
    return `${frame.getFileName().replace(cwd + "/", '')}:${frame.getLineNumber()}`
}

module.exports = {
    ping: ()=>{
        const frame = stackTrace.get()[1];
        
        console.log('ping:', getLineandNumber(frame));
    },
    test: (...message)=>{
        const frame = stackTrace.get()[1];
        // if(['development', 'test'].includes(config.env)){
        console.log(
            '\x1b[2m\n', ...processMessage(message), '\x1b[0m',
            getLineandNumber(frame), '\n'
        );
        // }
    },
    log: ({type = ['unknown'], message})=>{
        const frame = stackTrace.get()[1];
        if(isValid(type)){
            console.log(
                '\x1b[2m\n', processMessage(message), '\x1b[0m', '\n',
                getLineandNumber(frame), ' ', '[\'', type.join('\', \''), '\']', '\n'
            );
        }
    },
    error: ({type = ['unknown'], message})=>{
        const frame = stackTrace.get()[1];
        if(isValid(type)){
            console.error(
                '\x1b[31m\n', processMessage(message), '\x1b[0m', '\n',
                getLineandNumber(frame), ' ', type, '\n'
            );
        }
    },
    warn: ({type = ['unknown'], message})=>{
        const frame = stackTrace.get()[1];
        if(isValid(type)){
            console.warn(
                '\x1b[33m\n', processMessage(message), '\x1b[0m', '\n',
                getLineandNumber(frame), ' ', type, '\n'
            );
        }
    },
    info: ({type = ['unknown'], message})=>{
        const frame = stackTrace.get()[1];
        if(isValid(type)){
            console.info(
                '\x1b[36m\n', processMessage(message), '\x1b[0m', '\n',
                getLineandNumber(frame), ' ', type, '\n'
            );
        }
    }
}