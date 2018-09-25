const Ajv = require('ajv')
const ajv = new Ajv()
module.exports = function (rTypeArray, targetSettins, requestParams, req) {
    let output
    rTypeArray.some(function (key) {
        let rTypeSettings = targetSettins.data['$' + key]
        if (rTypeSettings) {
            let valid = ajv.validate({
                properties: rTypeSettings.match
            }, requestParams)
            if (valid) {
                output = key
                return true
            }
        }
    })
    return output
}
