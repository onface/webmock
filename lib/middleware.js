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
    let response = {}
    response.data = data[rType]

    response.statusCode = targetSettins.status
    if (typeof rTypeSettings.status !== 'undefined') {
        response.statusCode = rTypeSettings.status
    }
    response.timeout = targetSettins.timeout
    if (typeof rTypeSettings.timeout !== 'undefined') {
        response.timeout = rTypeSettings.timeout
    }
    response.header = targetSettins.header
    if (typeof rTypeSettings.header !== 'undefined') {
        response.header = rTypeSettings.header
    }
    response.cookie = targetSettins.cookie
    if (typeof rTypeSettings.cookie !== 'undefined') {
        response.cookie = rTypeSettings.cookie
    }
    setTimeout(function () {
        let mockCookie = mock(response.cookie)
        Object.keys(mockCookie).forEach(function (key) {
            res.cookie(key, mockCookie[key])
        })
        res.set(mock(response.header))
            .status(response.statusCode)
            .send( mock(response.data) );return
    }, response.timeout)
}
