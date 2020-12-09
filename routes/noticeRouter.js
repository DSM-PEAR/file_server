var express = require('express');
var router = express.Router();
var db = require('../models');
var config = require('../config/multer');

router.delete('/:file_id', (req, res) => {
    db.notice_tbl.findOne({
        where: {
            id: req.params.file_id
        }
    })
    .then(result => {
        var file = process.cwd() + "/uploads/noticeFiles/" + result.path;
        console.log(file);
        config.fs.unlinkSync(file);

        db.notice_tbl.destroy({
            where: {
                id: req.params.file_id
            }
        })
        res.json(success);
    })
    .catch(err => res.json(err));
})

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
})

router.post('/files/:notice_id', config.upload.single('noticeFile'), function(req, res){
    db.notice_tbl.create({
        path : req.file.filename,
        notice_id : req.params.notice_id
    }).then(result => res.json(result))
    .catch(err => res.json(err));
})


module.exports = router;