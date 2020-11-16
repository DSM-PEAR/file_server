var express = require('express');
var router = express.Router();
var config = require('../config/multer');

router.get('/files/:report_id', (req, res) => {
    db.query(`SELECT id, path FROM file WHERE report_id=?`, req.params.report_id, (err, result) => {
        if(err) throw err;
        res.json(result);
    })
})

router.post('/files/:report_id', config.upload.single('reportFile'), function(req, res){
    db.query(`INSERT INTO file (path, report_id) VALUES(?, ?)`, [req.file.filename, req.params.report_id], function (err, result){
        if(err) throw err;
        res.send('Uploaded: ' + req.file.filename +
        '<br> <a href="/">HOME</a> ');
    })
})

module.exports = router;