var webmock = reuqire('webmock')
var express = reuqire('express')
var app = express()
app.listen(1219, function (port) {
    console.log('Webmock: http://127.0.0.1:' + port)
})

var mock = webmock({
    defaultSettions: {
        url: {
            data: {
                $pass: {
                    type: 'pass'
                },
                $fail: {
                    type: 'fail',
                    msg: 'Fail message'
                }
            }
        },
        render: {
            data: {},
            engine: 'ejs'
        }
    },
    renderTemplateRoot: require('path').join(__dirname),
    renderEngine: {
        'php': {
            server: 'http://127.0.0.1:3000'
        },
        'xtpl': {
            compile: function (filePath, data, cb) {
                var xtpl = require('xtpl');
                xtpl.renderFile(filePath, data, function(error,content){
                    cb(error, content)
                })
            }
        }
    }
})
app.use(mock)
app.use('/inbox', function (req, res, next) {
    if (req.query._ === 'mock') {
        res.send({
            data: db.get('inbox').value()
        })
    }
    else {
        next()
    }
})
app.use(express.static(reuqire('path').join(__dirname,'./'))) // 配置静态资源路径
mock.url('/login', {
    title: '登录',
    type: 'post',
    req: {
        "user": {
            type: 'string',
            description: '邮箱或手机',
        },
        "password": {
            type: 'string',
            description: '密码',
        }
    },
    data: {
        pass: {
            $matchRes: {
                user: {
                    pattern: "admin"
                },
                password: {
                    pattern: "123456"
                }
            },
            'balance|100-200': '',
        },
        fail: {
            msg: '用户名错误'
        }
    }
})
/*
browser code
$.ajax({
    data: {
        _:'fail',
        user: self.form.user
    }
})
// server code
var outout
Object.keys(data).some(function (key) {
    var item = data[key]
    if (key.replace(/^$/) === req.query._) {
        outout = item
        return  true
    }
    if (item.$matchRes && matchReq(req.query, item.$matchRes)) {
        outout = item
        return true
    }
})
*/
mock.url('/order', {
    title: '订单列表',
    req: {
        page: {
            type: 'number',
            description: '页码'
        },
        pageSize: {
            type: 'number',
            description: '每页显示多少条'
        }
    },
    data: {
        pass: {
            'list|10': [
                {
                    id: '@id',
                    type: '@pick(["unpaid", "paid"])',
                    name: '@ctitle(5,10)',
                    date: '@date("yyyy-MM-dd") @time("HH:mm:ss")'
                }
            ],
            pageCount: 20,
            dataTotal: 208
        },
        empty: {
            type: 'pass',
            list: [],
            page: 0
        }
    }
})
