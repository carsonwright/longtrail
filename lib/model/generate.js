const fs = require('fs');
const path = require('path');
const _ = require('lodash')
_.mixin(require("lodash-inflection"));

module.exports = (name)=>{
    const example = fs.readFileSync(path.join(__dirname, '/example.js'), 'utf8');
    let file = example.replace(/ExampleName/g, name);
    file = file.replace(/exampleTableName/g, 
        _.camelCase(
            _.pluralize(name)
        )
    );
    
    let fileName = path.join(__dirname, `../../src/models/${name}.js`);

    if(!fs.existsSync(fileName)){
        fs.writeFileSync(fileName, file);
    }
    console.log(`generated model ${fileName}`)
}