const router = require('lib/router')()
const TestController = require('src/controllers/TestController')
router.resource('test', TestController)


module.exports = router;
