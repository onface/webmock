const defaultProps = require("./defaultProps")
const extend  = require('safe-extend')
class Webmock {
    constructor(props) {
        const self = this
        self.props = extend(true, defaultProps, props)
        self.data = {
            url: []
        }
    }
}
Webmock.prototype.url = require('./url')
Webmock.prototype.render = require('./render')
Webmock.prototype.server = function () {
    const self = this
    return function (req, res, next) {
        require('./express')(req, res, next, self)
    }
}
module.exports = Webmock
