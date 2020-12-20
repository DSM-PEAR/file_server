const mocha = require('mocha');
const should = require('should');
const request = require('request');
let { fs } = require('../config/multer');
const db = require('../models');

const baseURL = "http://localhost:3000";

// 공지사항 제출 상태 테스트 GET /notice/files/:notice_id
describe("Get notice file infomation", () => {
    it("200 OK", (done) => {
        request.get(`${baseURL}/notice/files/1`, (err, res, body) => {
            if(err) throw err;
            const data = JSON.parse(res.body);
            res.statusCode.should.be.equal(200);
            data[0].should.have.property('id').which.is.a.Number();
            data[0].should.have.property('path');
            done();
        })
    })

    it("404 If file does not exist", (done) => {
        request.get(`${baseURL}/notice/files/9999999`, (err, res, body) => {
            if(err) throw err;
            res.statusCode.should.be.equal(404);
            done();
        })
    })

    it("400 If notice_id should be Integer", (done) => {
        request.get(`${baseURL}/notice/files/abc`, (err, res, body) => {
            if(err) throw err;
            res.statusCode.should.be.equal(400);
            done();
        })
    })
})

// 보고서 제출 상태 테스트 GET /report/files/:report_id
describe("GET report file infomation", () => {
    it("200 OK", (done) => {
        request.get(`${baseURL}/report/files/1`, (err, res, body) => {
            if(err) throw err;
            const data = JSON.parse(res.body);
            res.statusCode.should.be.equal(200);
            data[0].should.have.property('id').which.is.a.Number();
            data[0].should.have.property('path');
            done();
        })
    })

    it("404 If file does not exist", (done) => {
        request.get(`${baseURL}/report/files/9999999`, (err, res, body) => {
            if(err) throw err;
            res.statusCode.should.be.equal(404);
            done();
        })
    })

    it("400 If report_id should be Integer", (done) => {
        request.get(`${baseURL}/report/files/abc`, (err, res, body) => {
            if(err) throw err;
            res.statusCode.should.be.equal(400);
            done();
        })
    })
})

// 공지사항 업로드 POST /notice/files/:notice_id
describe("POST notice file upload", () => {
    it("200 OK", (done) => {
        let formData = {
            notice_id: 1,
            noticeFile: fs.createReadStream(__dirname + '/iphone6.txt')
        }

        request.post({url: `${baseURL}/notice/files/1`, formData: formData}, (err, res, body) => {
            if(err) throw err;

            fs.existsSync(process.cwd() + '/uploads/noticeFiles/iphone6.txt').should.be.equal(true);
            const data = JSON.parse(res.body);
            data.id.should.be.a.Number();
            data.path.should.be.equal("iphone6.txt");
            res.statusCode.should.be.equal(200);
            done();
        })
    })

    /*
    it("400 If form name was not noticeFile", (done) => {
        
    })
    */
})

// 보고서 업로드 POST /report/files/:report_id
describe("POST report file upload", () => {
    it("200 OK", (done) => {
        let formData = {
            report_id: 1,
            reportFile: fs.createReadStream(__dirname + '/iphone6.txt')
        }

        request.post({url: `${baseURL}/report/files/1`, formData: formData}, (err, res, body) => {
            if(err) throw err;

            fs.existsSync(process.cwd() + '/uploads/reportFiles/iphone6.txt').should.be.equal(true);
            const data = JSON.parse(res.body);
            data.id.should.be.a.Number();
            data.path.should.be.equal("iphone6.txt");
            res.statusCode.should.be.equal(200);
            done();
        })
    })

    /*
    it("400 If form name was not reportFile", (done) => {
        
    })
    */
})

// 공지사항 파일 삭제 DELETE /notice/:file_id
describe("DELETE notice file", () => {
    it("200 OK", (done) => {
        request.delete(`${baseURL}/notice/19`, (err, res, body) => {
            if(err) throw err;

            fs.existsSync(process.cwd() + '/uploads/noticeFiles/iphone6.txt').should.be.equal(false);
            res.statusCode.should.be.equal(200);
            done();
        })
    })

    it("404 If file does not exist", (done) => {
        request.delete(`${baseURL}/notice/9999999`, (err, res, body) => {
            if(err) throw err;

            body.should.be.equal("파일이 존재하지 않습니다");
            res.statusCode.should.be.equal(404);
            done();
        })
    })
})

// 보고서 파일 삭제 DELETE /report/:file_id
describe("DELETE report file", () => {
    it("200 OK", (done) => {
        request.delete(`${baseURL}/report/5`, (err, res, body) => {
            if(err) throw err;

            fs.existsSync(process.cwd() + '/uploads/reportFiles/iphone6.txt').should.be.equal(false);
            res.statusCode.should.be.equal(200);
            done();
        })
    })

    it("404 If file does not exist", (done) => {
        request.delete(`${baseURL}/report/9999999`, (err, res, body) => {
            if(err) throw err;

            body.should.be.equal("파일이 존재하지 않습니다");
            res.statusCode.should.be.equal(404);
            done();
        })
    })
})