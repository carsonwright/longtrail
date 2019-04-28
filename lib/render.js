const stackTrace = require('stack-trace')
const config = require('config')

const getLineandNumber = (frame)=>{
    let cwd = process.cwd();
    if(!config.service){
        cwd = cwd.replace('/services/shark', '')
    }
    return `${frame.getFileName().replace(cwd + "/", '')}:${frame.getLineNumber()}`
}

module.exports = ({body, contentType, status})=>{
    const frame = stackTrace.get()[1];
    return {
        body: body || '',
        contentType: contentType || 'json',
        action: getLineandNumber(frame), 
        status:  status || 200
    }
}