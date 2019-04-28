module.exports = (config)=>{

    var {REDIS_URL} = process.env

    let redisURL = `${REDIS_URL}/0`

    config.redis = redisURL
    config.mailer = 'mailgun'
    config.texter = 'plivo'

    
    return config 
}