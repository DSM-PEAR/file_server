const mocha = require('mocha');
const should = require('should');
const request = require('request');

const baseURL = "http://3.15.177.120:3000";

describe("Get file infomation", () => {
    it("should be 200", (done) => {
        request.get(`${baseURL}/notice/files/1`, (err, res, body) => {
            if(err) throw err;
            res.statusCode.should.be.equal(200);
            done();
        })
    })

    it("if file does not exist 404", (done) => {
        request.get(`${baseURL}/notice/files/9999`, (err, res, body) => {
            if(err) throw err;
            res.statusCode.should.be.equal(404);
            done();
        })
    })
})