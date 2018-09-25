const Ajv = require('ajv')
const extend = require('safe-extend')
const ajv = new Ajv()
module.exports = function (rTypeArray, targetSettins, requestParams, req) {
    let output
    rTypeArray.some(function (key) {
        let rTypeSettings = targetSettins.data['$' + key]
        if (rTypeSettings) {
            let match = extend.clone(rTypeSettings.matchReq)
            let schemaOptions = extend(true, {}, match.schema)
            delete match.schema
            if (!schemaOptions.required) {
                schemaOptions.required = Object.keys(match)
            }
            schemaOptions.properties = match
            let valid = ajv.validate(schemaOptions, requestParams)
            if (valid) {
                output = key
                return true
            }
        }
    })
    return output
}
