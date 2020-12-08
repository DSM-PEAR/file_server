var express = require('express');
var router = express.Router();
var db = require('../models');
var config = require('../config/multer');

router.get('/:file_id', (req, res) => {
    db.notice_tbl.findOne({
        where: {
            id: req.params.file_id
        }
    }).then(result => {
        var file = process.cwd() + "/uploads/noticeFiles/" + result.path;

        if(config.fs.existsSync(file)){
            var filename = config.path.basename(file);
            var mimetype = config.mime.getType(file);

            res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            res.setHeader('Content-type', mimetype);

            var filestream = config.fs.createReadStream(file);
            filestream.pipe(res);
        } else {
            res.send('해당 파일이 없습니다.');
            return;
        }
    }).catch(error => {
        console.log(error);
        res.send('파일을 다운로드하는 중에 에러가 발생하였습니다.');
        return;
    })
})

router.get('/files/:notice_id', (req, res) => {
    
    db.notice_tbl.findAll({
        attributes: ['id', 'path'],
        where: {
            notice_id: req.params.notice_id,
        }
    }).then(result => res.json(result))
    .catch(err => res.json(err));

    /*db.query(`SELECT id, path FROM file WHERE notice_id=?`, req.params.notice_id, (err, result) => {
        if(err) throw err;
        res.json(result);
    })*/
})

router.post('/files/:notice_id', config.upload.single('noticeFile'), function(req, res){
    db.notice_tbl.create({
        path : req.file.filename,
        notice_id : req.params.notice_id
    }).then(result => res.json(result))
    .catch(err => res.json(err));
    
    /*db.query(`INSERT INTO file (path, notice_id) VALUES(?, ?)`, [req.file.filename, req.params.notice_id], function(err, result){
        if(err) throw err;
        res.send('Uploaded: ' + req.file.filename + 
        '<br> <a href="/">HOME</a>');
    })*/
})


module.exports = router;