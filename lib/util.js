function getUrlInfo (data) {
    return JSON.stringify({
        url: data.url,
        type: data.type,
        render: Boolean(data.view)
    })
}
module.exports = {
    getUrlInfo
}
