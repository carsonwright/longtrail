const config = require('config');
const email = require('./email')
const sms = require('./sms')

const messenger = {
    email: {
        send: (options)=>{
            return email[config.mailer](options)
        }
    },
    sms: {
        send: (options)=>{
            return sms[config.texter](options)
        }
    }
}

module.exports = messenger;