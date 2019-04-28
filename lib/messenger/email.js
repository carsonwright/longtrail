const _mailgun = require('mailgun-js');


const local = async (options)=>{
    console.log('=====================================')
    console.log('Type: Email')
    console.log('To: ', options.email)
    console.log('Subject: ', options.subject)
    console.log('Body: ', options.body)
    console.log('-------------------------------------')
    return true
};

const mailgun = (options)=>(
    new Promise((resolve, reject)=>{
        const client = _mailgun({
            apiKey: 'yourkey', 
            domain: 'mg-yours.example.io'
        });
    
    
        return client.messages().send({
            from: `${options.from || 'Your Company'} support@example.io`, 
            to: options.to,
            subject: options.subject,
            html: options.body
        }, (err, body)=>{
                if (err) reject(err)
                else     resolve(body)
            }
        );
    })
);


module.exports = {
    local,
    mailgun
}