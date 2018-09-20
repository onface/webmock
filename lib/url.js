const util = require('./util')
const extend = require('safe-extend')
module.exports = function (url, settings) {
    const self = this
    settings.url = url
    if (settings.url[0] === '/') {
        settings.url = settings.url.slice(1)
        console.warn(`node_modules/webmock: Automatic remore prefix ${settings.url} ~ ${settings.url.slice(1)}`)
    }
    if (typeof settings.type !== 'string') {
        throw new Error(`node_modules/webmock: mock.${settings.view?'render':'url'}({url: ${settings.url}}) must have type`)
    }
    let currentDefaultSettions = self.props.defaultSettions[settings.view?'render': 'url']
    settings = extend(true, currentDefaultSettions, settings)
    settings.type = settings.type.toUpperCase()
    let isExists = self.data.url.some(function (item) {
        return util.getUrlInfo(item) === util.getUrlInfo(settings)
    })
    if (isExists) {
        throw new Error(`node_modules/webmock: mock.${settings.view?'render':'url'}({url: ${settings.url}, type: ${settings.type}}) is already exist!`)
    }
    self.data.url.push(settings)
}
