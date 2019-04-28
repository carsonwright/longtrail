const freezer = require('lib/freezer')
const logger = require('lib/logger');
const config = require('config')
const querystring = require('querystring');
const routes = require('src/routes')

module.exports = async(req, res)=>{
    let response, body;
    const path = req.url.split('?')[0]

    const getParams = querystring.parse(
        req.url.split('?')[1]
    )

    if(config.env === 'development'){
        // console.log(req)
        console.log('==================================')
        console.log('Request Type:   ', req.method.toLowerCase(), path)
    }

    try{
        const url = path.slice(1, path.length)

        const action = {
            type: [req.method.toLowerCase(), ...url.split('/')],
            url,
            method: req.method.toLowerCase(),
            params: {
                ...(req.body || {}),
                ...getParams
            },
            headers: req.headers
        }

        try{

            const parameter = (params)=>{
                if(params instanceof Array){
                    params = params.map((key)=>
                        typeof params[key] == 'object' ? parameter(params[key]) : params[key]
                    )
                }else if(typeof params === 'object'){
                    params = Object.keys(params).reduce((acc, key)=>{
                        if(typeof params[key] === 'string'){
                            acc[key] = key.toLocaleLowerCase().includes('password') ?  '****************' :  params[key]
                        }else if(params[key] instanceof Object){
                            acc[key] = parameter(params[key])
                        }
                        return acc;
                    }, {})
                }
    
                return params
            }
            console.log('params:         ', JSON.stringify(parameter(action.params)))
        }catch(error){
            console.log("Couldn't parse params because", error)
        }
        
        response = await routes(action)
    }catch(error){
        res.writeHead(500)
        res.statusMessage = error
    }

    if(response){
        if(response.status){
            res.writeHead(response.status, {
                'Content-Type': response.contentType || 'application/json'
            })
            
            body = response.body
        }else{
            res.writeHead(200,  {
                'Content-Type': response.contentType || 'application/json'
            })
            body = response;
        }

        if(config.env === 'development'){
            let _body = null
            if(Array.isArray(body)){
                const name = (body[0] || {}).constructor.name
                _body = '[' + name + ', ...]' 
            }else if(typeof 'object'){
                _body = (body || {}).constructor.name
            }else{
                _body = JSON.stringify(body).split('').slice(0, 200).join('')
            }
            console.log('Response Body:  ', _body)
            if(response.action){
                console.log('Responding File:', response.action)
            }
        }

        if(typeof body === 'string'){
            res.write(body)
        }else{
            res.send(body)
        }

        console.log('----------------------------------')
    }else{
        res.writeHead(404)
        res.send()
    }
}