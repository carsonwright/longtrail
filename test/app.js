const app = require('src')
const logger = require('lib/logger');
const fs = require('fs')

const mocks = [];
app._actions = app.actions
app.actions = async (payload)=>{
    const response = await app._actions(payload);
    payload = JSON.parse(
        JSON.stringify(
            payload
        )
    )
    payload.verb = payload.type[0]
    payload.path = payload.type.slice(1, payload.type.length).join('/')
    payload.params = JSON.stringify(payload.params || "N/A", null, 4);
    payload.headers = JSON.stringify(payload.headers || "N/A", null, 4);
    
    const request = {
        payload,
        response,
        responseJSON: JSON.stringify(response, null, 4)
    };
    mocks.push(request);
    
    return response;
}
app.writeSpec = ()=>{
    if(`${process.env.WRITE_SPEC}`.toLocaleLowerCase() === 'true'){
        fs.writeFileSync('api.json', JSON.stringify({
            endpoints: mocks
        }, null, 4));
    }
}
module.exports = app