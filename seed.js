var normalizedPath = require("path").join(__dirname, "./db/seeds");
require('app-module-path').addPath(__dirname);
const files = require("fs").readdirSync(normalizedPath)
let seeds = [];


(async ()=>{
    for(let file of files){
        const fileName = `${normalizedPath}/` + file
        const seed = require(fileName)
        console.log(`Seeding`,  fileName)
        await (new seed()).run()
    }

    process.exit()
})()