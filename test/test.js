/**
 * Created by Teddycat on 23.01.2017.
 */
var assert = require('assert');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);
// describe('Array', function() {
//     describe('#indexOf()', function() {
//         it('should return -1 when the value is not present', function() {
//             assert.equal(-1, [1,2,3].indexOf(4));
//         });
//     });
// });

describe('POST /server', function() {
    it('response with status 200') , (done) => {
        chai.request(server)
            .get('/server')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('JSON');
                res.body.length.should.be.eql(0);
                done();
            });
    }
});