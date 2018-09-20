var request = require('supertest')
var createApp = require('./createApp')
var should = require('chai').should()
const app = createApp(function (mock) {
    mock.url('/login', {
        type: 'post',
        data: {
            pass: {
                'balance|100-200': '',
            }
        }
    })
})

describe('ajax.js', function() {
    it('should return pass data', function(done) {
        request(app)
        .post('/login?some=abc')
        .send('a=1')
        .expect(200)
        .then(res => {
            console.log(res.body)
            // res.body.should.equal('abc')
            done()
        })
    })
})
