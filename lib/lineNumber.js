const stackTrace = require('stack-trace');

module.exports = ()=>{
    const frame = stackTrace.get()[1];
    return `${frame.getFileName().replace(process.cwd() + "/", '')}:${frame.getLineNumber()}`
}