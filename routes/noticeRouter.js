var express = require('express');
var router = express.Router();
var db = require('../models');
var config = require('../config/multer');

const deleteFile = (id, res) => {
    db.notice_tbl.findOne({
        where: {
            id: id
        }
    })
    .then(result => {
        var file = process.cwd() + "/uploads/noticeFiles/" + result.path;
        config.fs.unlinkSync(file);

        db.notice_tbl.destroy({
            where: {
                id: id
            }
        })
        res.json(success);
    })
    .catch(err => res.json(err));
}

router.put('/:file_id', config.upload.single('noticeFile'), (req, res) => {
    db.notice_tbl.findOne({
        where: {
            id: req.params.file_id
        }
    })
    .then(find => {
        deleteFile(find.id);

        db.notice_tbl.update({
            path: req.file.filename,
        }, {
            where: {
                id: req.params.file_id,
            }
        }).then(result => res.json(result))
        .catch(err => res.json(err));

        res.send("PUT SUCCESS");
    })
    .catch(err => res.json(err));
})

router.delete('/:file_id', (req, res) => {
    deleteFile(req.params.file_id, res);
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
    if(!Number.isInteger(parseInt(req.params.notice_id))) {
        res.status(400).send("notice_id 다시 확인해주세요.")
        return;
    }

    db.notice_tbl.findAll({
        attributes: ['id', 'path'],
        where: {
            notice_id: req.params.notice_id,
        }
    })
    .then(result => {
        console.log(result);
        if(result[0] === undefined) {
            res.status(404).send("File not found");
        } else {
            res.json(result)
        }
    })
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