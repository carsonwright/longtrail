const router = require('lib/router')

const routes = router((rt)=>{
    const {HomeController} = require('./controllers')
    rt.resources('/', HomeController)
})


module.exports = routes