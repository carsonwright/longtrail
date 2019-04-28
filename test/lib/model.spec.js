const test = require('../specHelper');

const logger = require('lib/logger')
const Account = require('src/models/Account')
test.serial('Model', async (t)=>{
    let account;
    account = await Account.create({})
    t.true(!!account.id)
    
    await account.destroy()
    account = await Account.findBy({id: account.id})
    t.true(!account)
})

test.serial('Model', async (t)=>{
    let account;
    account = await Account.create({})
    t.true(!!account.id)
    
    let wasBlank = false
    try{
        await Account.where({id: undefined})
    }catch(error){
        wasBlank = error.message.includes('Blank arguments for Account')
    }
    t.true(wasBlank)
})