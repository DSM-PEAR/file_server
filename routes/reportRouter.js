var express = require('express');
var router = express.Router();
var db = require('../models');
var config = require('../config/multer');

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