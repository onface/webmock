# TODO

## matchQuery

```js
mock.url('/news', {
    title: '获取新闻数据'
    url: '/news',
    type: 'get',
    matchQuery: {
        ajax: true
    }
})
mock.render('/news', {
    title: '渲染新闻页面',
    type: 'get',
    view: 'view/index/index.html'
})
```
当 `url`时通过 `matchQuery` 去决定调用哪一个

因为暂时没有遇到这种需求，暂时不实现这个功能
