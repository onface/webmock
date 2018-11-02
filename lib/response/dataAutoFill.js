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
                if(item.replaceResponseType) {
                    value = item.replaceResponseType[info.rType]
                    if (typeof value === 'undefined') {
                        if (item.replaceResponseType['::default']) {
                            value = item.replaceResponseType['::default']
                        }
                        else {
                            value = info.rType
                        }
                    }
                }
            break
            case 'root':
                data = {
                    [item.key]: data
                }
                if (item.replaceRootIgnore) {
                    item.replaceRootIgnore.forEach(function (key) {
                        data[key] = data[item.key][key]
                        delete data[item.key][key]
                    })
                }
                if (JSON.stringify(data[item.key]) === '{}') {
                    delete data[item.key]
                }
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
