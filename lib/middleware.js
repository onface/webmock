var debug = require('debug')('webmock:middleware.js')
debug.log = console.log.bind(console)

const util = require('./util')
const whichItem = require('./response/whichItem')
const mock = require('./response/mock')
const extend = require('safe-extend')
const responseMatch = require('./response/match')
const responseRender = require('./response/render')
const createDoc = require('./createDoc')
const queryString = require('query-string');
const mime = require('mime-types')
const cookie = require('cookie')
module.exports = function (req, callback, next) {
    const self = this
    req.path = req.url.replace(/\?.*$/,'')
    req.query = req.url.replace(/^.*\?/,'') || {}
    req.query = queryString.parse(req.query)
    req.headers = req.headers || {}
    let targetSettins = whichItem(req, self)
    if (typeof targetSettins === 'undefined') {
        debug('Not find settings')
        debug('                 ')
        if (req.path === '/_' || req.path === '/') {
            callback({
                body: createDoc.bind(self)(),
                status: 200,
                headers: {
                    'Content-Type': 'text/html; charset=utf-8'
                }
            })
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
    let outputResponse = {}
    response.data = data[rType]

    response.status = targetSettins.status
    if (typeof rTypeSettings.status !== 'undefined') {
        response.status = rTypeSettings.status
    }
    response.timeout = targetSettins.timeout
    if (typeof rTypeSettings.timeout !== 'undefined') {
        response.timeout = rTypeSettings.timeout
    }
    response.headers = targetSettins.headers
    if (typeof rTypeSettings.headers !== 'undefined') {
        response.headers = rTypeSettings.headers
    }
    response.cookie = targetSettins.cookie
    if (typeof rTypeSettings.cookie !== 'undefined') {
        response.cookie = rTypeSettings.cookie
    }
    response.contentType = targetSettins.contentType
    if (typeof rTypeSettings.contentType !== 'undefined') {
        response.contentType = rTypeSettings.contentType
    }
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
    if (typeof targetSettins.commonData === 'object' && targetSettins.commonData[rType]) {
        debug('extend commonData')
        response.data = extend(true, response.data, targetSettins.commonData[rType])
    }
    response.cookie = fillData(response.cookie)
    let responseData = fillData(response.data)
    let sendResponse = function (content) {
        outputResponse.body = content
        outputResponse.headers = fillData(response.headers) || {}
        outputResponse.headers['content-type'] = mime.lookup(response.contentType) + '; charset=utf-8'
        outputResponse.status = response.status || 200
        outputResponse.timeout = response.timeout
        outputResponse.headers['set-cookie'] = ''
        Object.keys(response.cookie).forEach(function (name) {
            let value = response.cookie[name]
            outputResponse.headers['set-cookie'] = outputResponse.headers['cookie'] + cookie.serialize(name, value)
        })
        callback(outputResponse)
        return
    }
    if (targetSettins.view) {
        responseRender(responseData, targetSettins, self, sendResponse, req)
    }
    else {
        sendResponse(responseData)
    }
}
