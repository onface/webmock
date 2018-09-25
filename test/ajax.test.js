var request = require('supertest')
var createApp = require('./createApp')
var should = require('chai').should()
const app = createApp(function (mock) {
    mock.url('/login', {
        type: 'post',
        data: {
            pass: {
                'balance|100-200': 1,
            }
        }
    })
    mock.url('/login', {
        type: 'put'
    })
    mock.url('/news', {
        type: 'get',
        data: {
            pass: {
                lists: [
                    '瑞典电视台回应称“表达整体意思出现缺失”并未道歉',
                    '这个商品进了贸易战清单 俄罗斯愿助中国一臂之力',
                    '中国对外贸易实现历史性跨越 40年进口增长664倍'
                ]
            },
            empty:{
                list: []
            },
            $empty: {
                match: {
                    search: {
                        pattern: 'abc'
                    }
                }
            }
        }
    })
})

describe('ajax.js', function() {
    it('should return pass', function(done) {
        request(app)
        .post('/login')
        .expect(200)
        .then(res => {
            Object.keys(res.body).should.eql(['type', 'balance'])
            res.body.type.should.equal('pass')
            res.body.balance.should.above(99)
            res.body.balance.should.below(201)
            done()
        })
    })
    it('should return fail POST(_=fail)', function(done) {
        request(app)
        .post('/login')
        .send('_=fail')
        .expect(200)
        .then(res => {
            Object.keys(res.body).should.eql(['type', 'msg'])
            res.body.type.should.equal('fail')
            done()
        })
    })
    it('should return fail PUT(_=fail)', function(done) {
        request(app)
        .put('/login')
        .send('_=fail')
        .expect(200)
        .then(res => {
            Object.keys(res.body).should.eql(['type', 'msg'])
            res.body.type.should.equal('fail')
            done()
        })
    })
    it('should return empty GET(search_=abc)', function(done) {
        request(app)
        .get('/news?search=abc')
        .expect(200)
        .then(res => {
            Object.keys(res.body).should.eql(['type', 'list'])
            res.body.type.should.equal('empty')
            res.body.list.length.should.equal(0)
            done()
        })
    })
})
