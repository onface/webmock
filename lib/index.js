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
Webmock.prototype.connect = function () {
    const self = this
    return function (req, res, next) {
        require('./connect/express')(req, res, next, self)
    }
}
Webmock.prototype.writeDoc = function (filepath) {
    const self = this
    setTimeout(function () {
        require('./writeDoc').bind(self)(filepath)
    }, 0)
}
module.exports = Webmock
module.exports.express = require('./express')
