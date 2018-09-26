const path = require('path')
module.exports = function (data, settings, own, sendResponse) {
    const self = own
    const renderOptions = self.props.renderEngine[settings.engine]
    var root = self.props.renderViewRoot
    var filePath = path.join(root, settings.view)
    if(typeof renderOptions.compile === 'function') {
        renderOptions.compile(root, filePath, data, function (error, content) {
            if (error) {
                sendResponse(error.message)
            }
            else {
                sendResponse(content)
            }
        })
    }
}
