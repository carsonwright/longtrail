//const clearRequire = require('clear-require')
require('app-module-path').addPath(__dirname);
const Immutable = require('seamless-immutable') 

var os = require('os');
var path = require('path');



var historyFile = path.join(os.homedir(), '.node_history');

var repl = require('repl').start('longtrail> ');


const reload = (context)=>{
    /**
     * Removes a module from the cache.
     *
    };

    /*
    * Load a module, clearing it from the cache if necessary.
    */
   for(let key of Object.keys(require.cache)){
       if(key.includes('shark/src')){
           delete require.cache[key]
       }
       if(key.includes('shark/lib')){
           delete require.cache[key]
       }
       if(key.includes('shark/helpers')){
           delete require.cache[key]
       }
       if(key.includes('shark/db')){
           delete require.cache[key]
       }
       if(key.includes('shark/config')){
           delete require.cache[key]
       }
   }
    
    context.app = require('./src')
    return context
}

reload(repl.context)

repl.defineCommand('reload', {
    help: 'Reload application "src" and set it to app',
    action(name) {
        this.clearBufferedCommand();
        this.context = reload(this.context);
        this.displayPrompt();
    }
})

repl.on('reset', reload);

require('repl.history')(repl, historyFile);