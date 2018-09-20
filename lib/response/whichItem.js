module.exports = function (req, self) {
    let currentInfo = JSON.stringify({
        url: req.path.slice(1),
        type: req.method
    })
    let candidateItem = self.data.url.filter(function (item) {
        return currentInfo === JSON.stringify({url: item.url, type: item.type})
    })
    // 因为存在多个接口的 url type 相同的情况，所以需要进行多次筛选
    // 第一轮筛选：确定请求是 ajax
    if (req.xhr) {
        candidateItem = candidateItem.filter((item) => {
            return !item.view
        })
    }
    // 第二轮筛选：ajax 筛选后依然有个选项时，根据 user-agent 继续排除 render
    // (没有 ua 说明是非浏览器环境调用接口，一般是 IOS android 客户端调用接口，这种情况下肯定不是 render)
    let fromBrowser = Boolean(req.headers['user-agent'])
    if (candidateItem.length !== 1 && !fromBrowser) {
        candidateItem = candidateItem.filter((item) => {
            return !item.view
        })
    }
    // 第三轮筛选：还有多个选项时排除 ajax 返回 render
    if (candidateItem.length !== 1) {
        candidateItem = candidateItem.filter((item) => {
            console.log(item)
            return item.view
        })
    }
    return candidateItem[0]
}
