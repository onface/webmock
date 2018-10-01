var debug = require('debug')('webmock:response/render.js')
debug.log = console.log.bind(console)

const path = require('path')
const request = require('request')
var fs = require('fs')
const extend = require("extend")
const qs = require('querystring')
module.exports = function (data = {}, settings, own, sendResponse, req) {
    const self = own
    const renderOptions = self.props.renderEngine[settings.engine]
    var root = self.props.renderRoot
    var filePath = path.join(root, settings.view)
    if(typeof renderOptions.compile === 'function') {
        renderOptions.compile(root, filePath, data, function (error, content) {
            if (error) {
                sendResponse(error.message)
            }
            else {
                sendResponse(content)
            }
        })
    }
    else if (renderOptions.server) {
        var content = fs.readFileSync(filePath).toString()
        debug('request render server')
        debug('\t root', root)
        debug('\t filePath', filePath)
        debug('\t content', content)
        debug('\t data', data)
        request({
            method: 'POST',
            uri: renderOptions.server + '?' + qs.stringify(req.query),
            // Because req.body.hasOwnPropert is not a function
            // So extend(true, {}, req.body, ...)
            formData: extend(true, {}, req.body, {
                _webmock: JSON.stringify({
                    root,
                    filePath,
                    content,
                    data
                })
            })
        }, function (error, res, body) {
            if (error) {
                sendResponse(error.message)
            }
            else {
                sendResponse(res.body)
            }
        })
    }
    else {
        sendResponse(`Not find engine ${settings.engine} render`)
    }
}
