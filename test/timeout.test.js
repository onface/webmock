var request = require('supertest')
var createApp = require('./createApp')
var should = require('chai').should()
var mock
const app = createApp(function (webmock) {
    mock = webmock
})

describe('timeout.test.js', function() {
        mock.url('/timeout500', {
            type: 'get',
            timeout: 500
        })
        mock.url('/timeout', {
            type: 'get',
            data: {
                $pass: {
                    timeout: 200
                },
                $fail: {
                    timeout: 300
                }
            }
        })
    it('should return timeout 500', function (done) {
        var startTime = new Date().getTime()
        request(app)
        .get('/timeout500')
        .then(res => {
            (new Date().getTime() - startTime).should.above(499)
            done()
        })
    })
    it('should return timeout 200', function (done) {
        var startTime = new Date().getTime()
        request(app)
        .get('/timeout')
        .then(res => {
            (new Date().getTime() - startTime).should.above(199)
            done()
        })
    })
    it('should return timeout 300', function (done) {
        var startTime = new Date().getTime()
        request(app)
        .get('/timeout?_=fail')
        .then(res => {
            (new Date().getTime() - startTime).should.above(299)
            done()
        })
    })
})
