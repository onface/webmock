module.exports = {
    url: {
        data: {
            pass: {

            },
            fail: {
                msg: 'Fail message'
            }
        },
        reqType: 'application/x-www-form-urlencoded',
        status: 200,
        timeout: 0,
        headers: {},
        cookie: {},
        contentType: 'html',
        mock: true,
        notes: undefined,
        dataAutoFill: [
            {
                key: 'type',
                replace: 'rType',
                /*
                replacerTypeMap: {
                    'pass': 1,
                    'fail': 0
                }
                */
            },
            /*
            {
                key: 'data',
                replace: 'root',
                replaceRootIgnore: ['msg']
            }
            */
        ]
    },
    render: {
        data: {},
        status: 200,
        timeout: 0,
        headers: {},
        cookie: {},
        contentType: 'html',
        mock: true,
        notes: undefined,
        dataAutoFill: [
            {
                key: 'type',
                replace: 'rType'
            },
            /*
            {
                key: 'data',
                replace: 'root'
            }
            */
        ],
        engine: 'ejs'
    },
    renderRoot: process.cwd(), // require('path').join(__dirname)
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
