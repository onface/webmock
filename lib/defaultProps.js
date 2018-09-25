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
            dataAutoComple: {
                key: 'type',
                replace: 'rType'
            }
        },
        render: {
            data: {},
            engine: 'ejs'
        }
    },
    renderTemplateRoot: false, // require('path').join(__dirname)
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
            server: 'http://127.0.0.1:7233'
        }
    }
}
