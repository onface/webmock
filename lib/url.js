const util = require('./util')
const extend = require('safe-extend')
const dataAutoFill = require('./response/dataAutoFill')
module.exports = function (url, settings) {
    const self = this
    settings.url = url
    if (settings.url[0] !== '/') {
        settings.url = `/${settings.url}`
        console.warn(`node_modules/webmock: Automatic compile prefix ${url} ~ ${settings.url}`)
    }
    if (typeof settings.type !== 'string') {
        throw new Error(`node_modules/webmock: mock.${settings.view?'render':'url'}({url: "${settings.url}"}) must have type`)
    }
    let currentDefaultSettions = self.props[settings.view?'render': 'url']
    settings = extend(true, currentDefaultSettions, settings)
    settings.type = settings.type.toUpperCase()
    let isExists = self.data.url.some(function (item) {
        return util.getUrlInfo(item) === util.getUrlInfo(settings)
    })
    if (isExists) {
        throw new Error(`node_modules/webmock: mock.${settings.view?'render':'url'}({url: "${settings.url}", type: "${settings.type}"}) is already exist!`)
    }
    let rTypeArray = Object.keys(settings.data).filter(function (key) {
        return key[0] !== '$'
    })
    rTypeArray.forEach(function (key) {
        settings.data[key] = dataAutoFill(settings.data[key], settings.dataAutoFill, { rType: key })
    })
    if (settings.engine) {
        if (typeof self.props.renderEngine[settings.engine] === 'undefined') {
            throw new Error(`node_modules/webmock: mock.${settings.view?'render':'url'}({url: "${settings.url}", type: "${settings.type}", engine: "${settings.engine}"}) engine in \`new Webmock(props)\` props.renderEngine is not find`)
        }
    }
    self.data.url.push(settings)
}
