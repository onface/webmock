const util = require('./util')
const whichItem = require('./response/whichItem')
module.exports = function (req, res, next, own) {
    const self = own
    let targetSettins = whichItem(req, own)
    res.send(targetSettins)
}
