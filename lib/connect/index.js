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
    }
}
