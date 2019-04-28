const fs = require('fs');
const path = require('path');

module.exports = (name)=>{
    const example = fs.readFileSync(path.join(__dirname, '/example.js'), 'utf8');
    
    const file = example.replace(/exampleName/g, name);
    
    const fileNamePath = `${name}.js`;
    const fileName = path.join(__dirname, `../seeds/${fileNamePath}`)
    if(!fs.existsSync(fileName)){
        fs.writeFileSync(fileName, file);
    }
    console.log(`generated seed db/seeds/${fileNamePath}`)
}