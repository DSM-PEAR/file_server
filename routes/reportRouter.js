var express = require('express');
var router = express.Router();
var db = require('../models');
var config = require('../config/multer');

router.delete('/:file_id', (req, res) => {
    db.report_tbl.findOne({
        where: {
            id: req.params.file_id
        }
    })
    .then(result => {
        var file = process.cwd() + "/uploads/reportFiles/" + result.path;
        console.log(file);
        config.fs.unlinkSync(file);

        db.report_tbl.destroy({
            where: {
                id: req.params.file_id
            }
        })
        res.json(success);
    })
    .catch(err => res.json(err));
})

router.get('/:file_id', (req, res) => {
    db.report_tbl.findOne({
        where: {
            id: req.params.file_id
        }
    }).then(result => {
        var file = process.cwd() + "/uploads/reportFiles/" + result.path;

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

router.get('/files/:report_id', (req, res) => {
    
    db.report_tbl.findAll({
        attributes: ['id', 'path'],
        where: {
            report_id: req.params.report_id,
        }
    }).then(result => res.json(result))
    .catch(err => res.json(err));
    
    /*db.query(`SELECT id, path FROM file WHERE report_id=?`, req.params.report_id, (err, result) => {
        if(err) throw err;
        res.json(result);
    })*/
})

router.post('/files/:report_id', config.upload.single('reportFile'), function(req, res){
    db.report_tbl.create({
        path : req.file.filename,
        report_id : req.params.report_id
    }).then(result => res.json(result))
    .catch(err => res.json(err));

    /*db.query(`INSERT INTO file (path, report_id) VALUES(?, ?)`, [req.file.filename, req.params.report_id], function (err, result){
        if(err) throw err;
        res.send('Uploaded: ' + req.file.filename +
        '<br> <a href="/">HOME</a> ');
    })*/
})

module.exports = router;