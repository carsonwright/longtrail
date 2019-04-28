const test = require('../specHelper');

const logger = require('lib/logger')

test.serial('logger.log', async (t)=>{
    const originalLog = console.log
    let logged;
    console.log = (..._logged)=>{
        logged = JSON.stringify(_logged)
    }
    logger.log({message: 'hello'})

    t.is(logged.replace('services/shark/', ''), '["\\u001b[2m\\n","hello","\\u001b[0m","\\n","test/lib/logger.spec.js:13"," ","[\'","unknown","\']","\\n"]')
    console.log = originalLog
})

test.serial('logger.test', async (t)=>{
    const originalLog = console.log
    let logged;
    console.log = (..._logged)=>{
        logged = JSON.stringify(_logged)
    }
    logger.test({message: 'hello'})

    t.is(logged.replace('services/shark/', ''), '["\\u001b[2m\\n",{"message":"hello"},"\\u001b[0m","test/lib/logger.spec.js:25","\\n"]')
    console.log = originalLog
})

test.serial('logger.error', async (t)=>{
    const originalError = console.error
    let logged;
    console.error = (..._logged)=>{
        logged = JSON.stringify(_logged)
    }
    logger.error({message: 'hello'})

    t.is(logged.replace('services/shark/', ''), '["\\u001b[31m\\n","hello","\\u001b[0m","\\n","test/lib/logger.spec.js:37"," ",["unknown"],"\\n"]')
    console.error = originalError
})

test.serial('logger.info', async (t)=>{
    const originalInfo = console.info
    let logged;
    console.info = (..._logged)=>{
        logged = JSON.stringify(_logged)
    }
    logger.info({message: 'hello'})

    t.is(logged.replace('services/shark/', ''), '["\\u001b[36m\\n","hello","\\u001b[0m","\\n","test/lib/logger.spec.js:49"," ",["unknown"],"\\n"]')
    console.info = originalInfo
})