var express = require('express');
var router = express.Router();
var db = require('../models');
var config = require('../config/multer');

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