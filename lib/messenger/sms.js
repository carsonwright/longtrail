let _plivo = require('plivo');

const local = async (options)=>{
    console.log('=====================================')
    console.log('Type: SMS')
    console.log('To: ', options.mobilePhone)
    console.log('Subject: ', options.subject)
    console.log('Body: ', options.body)
    console.log('-------------------------------------')
    return true
}
const plivo = async (options)=>{
    let client = new _plivo.Client(
        'your data',
        'your data'
    );
    
    return await client.messages.create(
        '+1-555-555-5555',
        options.to,
        options.body
    )
}


module.exports = {
    local,
    plivo
}