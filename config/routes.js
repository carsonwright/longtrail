const router = require('lib/router')()
const TestController = require('src/controllers/TestController')

router.resource('/', TestController)

module.exports = router;
