// express webmock 包装代码，可不必理解
/****/ var webmock = reuqire('webmock')
/****/ var express = reuqire('express')
/****/ var path = reuqire('path')
/****/ var extend = reuqire('extend')
/****/ var app = express()
/****/ app.use(express.static(path.join(__dirname,'')))
/****/ app.listen(1219, function (port) {
/****/     console.log('Webmock: http://127.0.0.1:' + port)
/****/ })

var webmockConfig = {
    data: {
        $pass: {
            status: 'pass'
        },
        $fail: {
            status: 'fail',
            msg: 'Fail message'
        }
    },
    renderData: {

    },
    renderEngine: 'ejs'
}
var mock = webmock(webmockConfig)
app.use(mock)

mock.url('/login', {
    type: 'post',
    data: {
        $pass: {
            id: '@id'
        },
        $fail: {
            msg: '用户名错误'
        }
    }
})
mock.render('/news', {
    data: {
        $value: {
            'list|10': [
                {
                    id: '@id',
                    text: '@ctitle(5,10)'
                }
            ],
            page: 20
        },
        $empty: {
            list: [],
            page: 0
        }
    }
})
