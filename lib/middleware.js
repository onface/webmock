var debug = require('debug')('webmock:middleware.js')
debug.log = console.log.bind(console)

const util = require('./util')
const whichItem = require('./response/whichItem')
const mock = require('./response/mock')
const extend = require('safe-extend')
const responseMatch = require('./response/match')
module.exports = function (req, res, next, own) {
    const self = own
    let targetSettins = whichItem(req, own)
    debug('targetSettins', targetSettins)
    debug('url', targetSettins.url)
    if (typeof targetSettins === 'undefined') {
        debug('Not find settings')
        next();return
    }
    let data = targetSettins.data
    let requestParams = extend(true, req.query, req.body)
    let rTypeArray = Object.keys(data).filter(function (key) {
        return key[0] !== '$'
    })
    debug('response type', rTypeArray)
    let rType = rTypeArray[0]
    if (requestParams._) {
        debug(`rType use request param: _=${requestParams._}`)
        rType = requestParams._
    }
    else {
        let matchResponseType = responseMatch(rTypeArray, targetSettins, requestParams, req)
        if (matchResponseType) {
            debug(`rType use ${matchResponseType}, because $${matchResponseType}.match matched`)
            rType = matchResponseType
        }
    }
    let rTypeSettings = targetSettins.data[`$${rType}`] || {}
    let responseData = data[rType]
    responseData = mock(responseData)

    let statusCode = targetSettins.status
    if (typeof rTypeSettings.status !== 'undefined') {
        statusCode = rTypeSettings.status
    }
    let timeout = targetSettins.timeout
    if (typeof rTypeSettings.timeout !== 'undefined') {
        timeout = rTypeSettings.timeout
    }
    setTimeout(function () {
        res.status(statusCode)
        res.send(responseData);return
    }, timeout)
}
