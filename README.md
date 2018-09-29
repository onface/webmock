# Webmock

```shell
yarn add express cookie-parser body-parser cors webmock
```

```js
var Webmock = require('webmock')
const { mock , app } = Webmock.express({
    port: 1219,
    static: __dirname,
    url: {
        data: {
            pass: {},
            fail: {msg: 'fail message'}
        }
    }
})
// mock.writeDoc(__dirname + '/doc.html')
mock.url('/news', {
    type: 'get',
    data: {
        pass: {
            'list|10': {
                title: '@ctitle'
            }
        },
        empty: {
            'list': []
        }
    }
})

mock.url('/login', {
    type: 'post',
    // JSON schema
    request: {
        user: {
            title: '用户名',
            example: 'nimo'
        },
        password: {
            title: '密码',
            example: 'abcddefg'
        }
    }
})
```

- `Webmock.express(props)` default props is : [./lib/defaultProps.js](./lib/defaultProps.js)
- `mock.url(settings)` default settings is "./lib/defaultProps.js" url
