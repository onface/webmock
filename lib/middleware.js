const util = require('./util')
const whichItem = require('./response/whichItem')
const extend = require('safe-extend')
module.exports = function (req, res, next, own) {
    const self = own
    let targetSettins = whichItem(req, own)
    let data = targetSettins.data
    let getAndPost = extend(true, req.query, req.body)
    let rType = Object.keys(data)[0]

    if (getAndPost._) {
        rType = getAndPost._
    }
    else {

    }
}
