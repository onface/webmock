const ejs = require('ejs')
const path = require('path')
const fs = require('fs')
const mock = require('./response/mock')
module.exports = function (filepath) {
    const self = this
    let data = self.data.url.map(function (item) {
        item.mockedData = mock(item.data)
        return item
    })
    var content = ejs.render(require('./template/doc.js'), {data: JSON.stringify(data, null, 4)})
    fs.writeFileSync(filepath, content)
}
