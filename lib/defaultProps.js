module.exports = {
    defaultSettions: {
        url: {
            data: {
                pass: {

                },
                fail: {
                    msg: 'Fail message'
                }
            },
            status: 200,
            timeout: 0,
            header: {},
            cookie: {},
            mock: true,
            dataAutoFill: [
                {
                    key: 'type',
                    replace: 'rType'
                },
                // {
                //     key: 'data',
                //     replace: 'root'
                // }
            ]
        },
        render: {
            data: {},
            status: 200,
            timeout: 0,
            header: {},
            cookie: {},
            mock: true,
            dataAutoFill: [
                {
                    key: 'type',
                    replace: 'rType'
                },
                // {
                //     key: 'data',
                //     replace: 'root'
                // }
            ],
            engine: 'ejs'
        }
    },
    renderViewRoot: false, // require('path').join(__dirname)
    renderEngine: {
        'ejs': {
            compile: function (root, filePath, data, cb) {
                var ejs = require('ejs')
                ejs.renderFile(filePath, data, {root: root}, function (error, content){
                    cb(error, content)
                })
            }
        },
        'php': {
            server: 'http://127.0.0.1:7233/'
        }
    }
}
