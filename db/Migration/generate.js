const fs = require('fs');
const path = require('path');
const moment = require('moment')

module.exports = (name)=>{
    const example = fs.readFileSync(path.join(__dirname, '/example.js'), 'utf8');
    const file = example.replace(/exampleName/g, name);
    
    let fileNamePath = `${moment().format('YYYYMMDDHHmmSS')}_${name}.js`;

    let fileName = path.join(__dirname, `../migrations/${fileNamePath}`)

    if(!fs.existsSync(fileName)){
        fs.writeFileSync(fileName, file);
    }
    console.log(`generated migration db/migrations/${fileNamePath}`)
}