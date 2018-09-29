var debug = require('debug')('webmock:middleware.js')
debug.log = console.log.bind(console)

const util = require('./util')
const whichItem = require('./response/whichItem')
const mock = require('./response/mock')
const extend = require('safe-extend')
const responseMatch = require('./response/match')
const responseRender = require('./response/render')
const createDoc = require('./createDoc')
module.exports = function (req, res, next, own) {
    const self = own
    let targetSettins = whichItem(req, own)
    if (typeof targetSettins === 'undefined') {
        debug('Not find settings')
        debug('                 ')
        if (req.path === '/_' || req.path === '/') {
            res.send(createDoc.bind(self)())
            return
        }
        else {
            next();return
        }
    }
    debug('targetSettins', targetSettins)
    debug('url', targetSettins.url)
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
        function fillData (data) {
            let useMock = targetSettins.mock
            if (typeof rTypeSettings.mock !== 'undefined') {
                useMock = rTypeSettings.mock
            }
            if (useMock) {
                return mock(data)
            }
            else {
                return data
            }
        }
        let mockCookie = fillData(response.cookie)
        Object.keys(mockCookie).forEach(function (key) {
            res.cookie(key, mockCookie[key])
        })
        if (typeof targetSettins.commonData === 'object' && targetSettins.commonData[rType]) {
            debug('extend commonData')
            response.data = extend(true, response.data, targetSettins.commonData[rType])
        }
        let responseData = fillData(response.data)
        let sendResponse = function (content) {
            if (typeof content === 'object') {
                content = JSON.stringify(content, null, 4)
            }
            res.set(fillData(response.header))
                .status(response.statusCode)
                .send( content );return
        }
        if (targetSettins.view) {
            responseRender(responseData, targetSettins, self, sendResponse)
        }
        else {
            sendResponse(responseData)
        }
    }, response.timeout)
}
