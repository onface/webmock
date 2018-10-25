const queryString = require('query-string')
module.exports = function (type) {
    let mock = this
    switch(type) {
        case 'express':
            return function (req, res, next) {
                mock.middleware(
                    {
                        url: req.url,
                        body: req.body,
                        method: req.method,
                        headers: req.headers
                    },
                    function callback(data) {
                        setTimeout(function () {
                            res.set(data.headers)
                                .status(data.status)
                                .send(data.body)
                        }, data.timeout)
                    },
                    next
                )
            }
        break
        case 'stdlib':
        return function (context, callback) {
            let body = {}
            if (context.http.method !== 'GET') {
                if (/json/.test(context.http.headers['content-type'])) {
                    body = JSON.parse(context.http.body)
                }
                else {
                    body = queryString(context.http.body)
                }
            }
            mock.middleware(
                {
                    url: context.http.url,
                    body: body,
                    method: context.http.method,
                    headers: context.http.headers
                },
                function (data) {
                    setTimeout(function () {
                        callback(data.body, data.headers, data.status)
                    }, data.timeout)
                },
                function () {
                    callback('not found')
                }
            )
        }
        break
    }
}
