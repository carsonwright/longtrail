const fs = require('fs');
const path = require('path');
const _ = require('lodash')
_.mixin(require("lodash-inflection"));

module.exports = (name)=>{
    const example = fs.readFileSync(path.join(__dirname, '/example.js'), 'utf8');
    let file = example.replace(/ExampleName/g, name);
    const exampleWorkerName =  _.camelCase(
        _.pluralize(name)
    )
    file = file.replace(/exampleWorkerName/g, exampleWorkerName);
    
    let fileName = path.join(__dirname, `../../src/workers/${name}.js`);
    
    if(!fs.existsSync(fileName)){
        fs.writeFileSync(fileName, file);
    }
    
    let workersBootstrap = path.join(__dirname, `../../src/workers/bootstrap.json`);
    const contents = JSON.parse(fs.readFileSync(workersBootstrap, 'utf8'))

    contents[exampleWorkerName] = exampleWorkerName
    fs.writeFileSync(workersBootstrap, JSON.stringify(contents, null, 4))
    console.log(`generated worker ${fileName}`)
}