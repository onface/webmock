var debug = require('debug')('webmock:whichItem.js')
debug.log = console.log.bind(console)
module.exports = function (req, self) {
    let currentInfo = JSON.stringify({
        url: req.path,
        type: req.method
    })
    let candidateItem = self.data.url.filter(function (item) {
        return currentInfo === JSON.stringify({url: item.url, type: item.type})
    })
    debug('url:', req.path)
    debug('Get candidateItem:', candidateItem)
    // 因为存在多个接口的 url type 相同的情况，所以需要进行多次筛选
    // 第一轮筛选：确定请求是 ajax
    if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        candidateItem = candidateItem.filter((item) => {
            return !item.view
        })
    }
    debug('First filter candidateItem:', candidateItem)
    // 第二轮筛选：ajax 筛选后依然有个选项时，根据 user-agent 继续排除 render
    // (没有 ua 说明是非浏览器环境调用接口，一般是 IOS android 客户端调用接口，这种情况下肯定不是 render)
    let fromBrowser = Boolean(req.headers['user-agent'])
    if (candidateItem.length !== 1 && !fromBrowser) {
        candidateItem = candidateItem.filter((item) => {
            return !item.view
        })
    }
    debug('Second filter candidateItem:', candidateItem)
    // 第三轮筛选：还有多个选项时排除 ajax 返回 render
    if (candidateItem.length !== 1) {
        candidateItem = candidateItem.filter((item) => {
            console.log(item)
            return item.view
        })
    }
    debug('Thirdly filter candidateItem:', candidateItem)
    return candidateItem[0]
}
