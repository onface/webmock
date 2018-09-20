module.exports = function (url, settings) {
    const self = this
    if (!settings.view) {
        throw new Error('node_modules/webmock: mock.render(settings) settings.view is required')
    }
    settings.type = settings.type || 'get'
    self.url(url, settings)
}
