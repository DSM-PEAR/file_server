var express = require('express');
var router = express.Router();
var config = require('../config/multer');

router.delete('/:file_id', (req, res) => {
    db.query(`DELETE FROM file WHERE id=?`, req.params.file_id, (err, result) => {
        if(err) throw err;
        res.send("파일이 삭제 되었습니다!");
    })
})

router.get('/:file_id', (req, res) => {
    try{
        db.query(`SELECT * FROM file WHERE id=?`, req.params.file_id, (err, result) => {
            if(err) throw err;
            if(result[0].report_id != 0){
                var file = __dirname + "/uploads/reportFiles/" + result[0].path;
            } else if(result[0].notice_id != 0) {
                var file = __dirname + "/uploads/noticeFiles/" + result[0].path;
            }

            
            if(config.fs.existsSync(file)){
                var filename = path.basename(file);
                var mimetype = mime.getType(file);

                res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                res.setHeader('Content-type', mimetype);

                var filestream = config.fs.createReadStream(file);
                filestream.pipe(res);
            } else {
                res.send('해당 파일이 없습니다.');
                return;
            }
        });
    } catch(e){
        console.log(e);
        res.send('파일을 다운로드하는 중에 에러가 발생하였습니다.');
        return;
    }
});

router.put('/:file_id', config.upload.single('userfile'), (req, res) => {
    db.query(`SELECT report_id FROM file WHERE id=?`, req.params.file_id, (err, result) => {
        if(err) throw err;
        db.query(`DELETE FROM file WHERE id=?`, req.params.file_id, (err2, result2) => {
            if(err2) throw err2;
            db.query(`INSERT INTO file (path, report_id) VALUES(?, ?)`, [req.file.filename, result[0].report_id], (err3, result3) => {
                if(err3) throw err3;
                res.send('Changed: ' + req.file.filename + '<br> <a href="/">HOME</a>');
            })
        })
    })
})

module.exports = router;