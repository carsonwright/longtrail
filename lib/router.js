const logger = require('lib/logger');
const match = require('url-pattern-match');

module.exports = (url)=>{
    const matcher = {
        partial: (...urlParams)=>{
            return {
                urlParams,
                partial: (..._urlParams)=>{
                    matcher.partial(urlParams.concat(_urlParams))
                },
                test: ()=>{
                    matcher.test(urlParams)
                }
            }
        },
        test: (urlParams)=>(
            
            match(url.join('/'), urlParams.join('/'))
        )
    }

    return matcher;
}