const util = require('../util')
module.exports = function (rTypeArray, targetSettins, requestParams, req) {
    let output
    rTypeArray.some(function (key) {
        let rTypeSettings = targetSettins.data['$' + key]
        if (rTypeSettings) {
            if (util.validateSimpleSchema(rTypeSettings.matchReq, requestParams)) {
                output = key
                return true
            }
        }
    })
    return output
}
