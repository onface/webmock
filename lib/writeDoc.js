const createDoc = require('./createDoc')
const fs = require('fs')
module.exports = function (filepath) {
    const self = this
    fs.writeFileSync(filepath, createDoc.bind(self)())
}
