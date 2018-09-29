const middleware = require('../middleware')
module.exports = function (req, res, next, own) {
    middleware(req, res, next, own)
}
