const extend = require('safe-extend')
var debug = require('debug')('webmock:util.js')
debug.log = console.log.bind(console)
const Ajv = require('ajv')
const ajv = new Ajv()
function getUrlInfo (data) {
    return JSON.stringify({
        url: data.url,
        type: data.type,
        render: Boolean(data.view)
    })
}
function validateSimpleSchema (options, json) {
    if (!options || JSON.stringify(options) === '{}') {
        debug('function validateSimpleSchema: skip empty schema')
        return false
    }
    let match = extend.clone(options)
    let schemaOptions = extend(true, {}, match.schema)
    delete match.schema
    if (!schemaOptions.required) {
        schemaOptions.required = Object.keys(match)
    }
    schemaOptions.properties = match
    return ajv.validate(schemaOptions, json)
}
module.exports = {
    getUrlInfo,
    validateSimpleSchema
}
