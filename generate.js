const migration = require('./db/Migration/generate')
const seed = require('./db/Seed/generate')
const model = require('./lib/model/generate')
const worker = require('./lib/worker/generate')


switch(process.argv[2]){
    case 'migration':
        return migration(process.argv[3])
    case 'seed':
        return seed(process.argv[3])
    case 'model':
        return model(process.argv[3])
    case 'worker':
        return worker(process.argv[3])
}