var debug = require('debug')('webmock:middleware.js')
debug.log = console.log.bind(console)

const util = require('./util')
const whichItem = require('./response/whichItem')
const mock = require('./response/mock')
const extend = require('safe-extend')
module.exports = function (req, res, next, own) {
    const self = own
    let targetSettins = whichItem(req, own)
    debug('targetSettins', targetSettins)
    if (typeof targetSettins === 'undefined') {
        debug('Not find settings')
        next();return
    }
    let data = targetSettins.data
    let getAndPost = extend(true, req.query, req.body)
    let rTypeArray = Object.keys(data).filter(function (key) {
        return key[0] !== '$'
    })
    debug('response type', rTypeArray)
    let rType = rTypeArray[0]
    if (getAndPost._) {
        rType = getAndPost._
    }
    else {

    }
    let responseData = data[rType]
    responseData = mock(responseData)
    res.send(responseData);return
}
