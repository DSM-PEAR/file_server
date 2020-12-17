const mocha = require('mocha');
const should = require('should');
const request = require('request');

const baseURL = "http://3.15.177.120:3000";

// 공지사항 제출 상태 테스트 GET /notice/files/:notice_id
describe("Get notice file infomation", () => {
    it("should be 200", (done) => {
        request.get(`${baseURL}/notice/files/1`, (err, res, body) => {
            if(err) throw err;
            const data = JSON.parse(res.body);
            res.statusCode.should.be.equal(200);
            data[0].should.have.property('id').which.is.a.Number();
            data[0].should.have.property('path');
            done();
        })
    })

    it("if file does not exist 404", (done) => {
        request.get(`${baseURL}/notice/files/9999999`, (err, res, body) => {
            if(err) throw err;
            res.statusCode.should.be.equal(404);
            done();
        })
    })

    it("if notice_id should be Integer", (done) => {
        request.get(`${baseURL}/notice/files/abc`, (err, res, body) => {
            if(err) throw err;
            res.statusCode.should.be.equal(400);
            done();
        })
    })
})

// 보고서 제출 상태 테스트 GET /report/files/:report_id
describe("Get report file infomation", () => {
    it("should be 200", (done) => {
        request.get(`${baseURL}/report/files/1`, (err, res, body) => {
            if(err) throw err;
            const data = JSON.parse(res.body);
            res.statusCode.should.be.equal(200);
            data[0].should.have.property('id').which.is.a.Number();
            data[0].should.have.property('path');
            done();
        })
    })

    it("if file does not exist 404", (done) => {
        request.get(`${baseURL}/report/files/9999999`, (err, res, body) => {
            if(err) throw err;
            res.statusCode.should.be.equal(404);
            done();
        })
    })

    it("if notice_id should be Integer", (done) => {
        request.get(`${baseURL}/report/files/abc`, (err, res, body) => {
            if(err) throw err;
            res.statusCode.should.be.equal(400);
            done();
        })
    })
})