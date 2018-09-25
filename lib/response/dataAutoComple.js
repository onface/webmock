const extend = require('safe-extend')
module.exports = function (data, settings, info) {
    if (!settings) {
        return data
    }
    if (!Array.isArray(settings)) {
        settings = [settings]
    }
    let fillData = {}
    settings.forEach(function (item) {
        let value
        switch(item.replace) {
            case 'rType':
                value = info.rType
            break
        }
        fillData[item.key] = value
    })
    // extend 能让 dataAutoComple 添加的属性在最前面
    // 例如 type 是 dataAutoComple 添加的属性
    // {
    //     type: 'pass',
    //     age: 12
    // }
    // {
    //     age: 12,
    //     type: 'pass'
    // }
    return extend(true, fillData, data)
}
