const ejs = require('ejs')
const path = require('path')
const fs = require('fs')
const mock = require('./response/mock')
const arraySort = require('array-sort')

module.exports = function (filepath) {
    const self = this
    let data = self.data.url
    let words = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
    let charOrder = 'abcdefghijklmnopqrstuvwxyz0123456789'
    // 排序 url 使得无论 mock.url 的执行时机如何，文档生成的顺序都是按字母排序的。
    data = data.sort(function (a, b) {
        return a.url < b.url ? -1 : 1
    })
    var content = ejs.render(require('./template/doc.js'), {data: JSON.stringify(data, null, 4)})
    return content
}
