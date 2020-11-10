var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var AdmZip = require('adm-zip');
var path = require('path');
var mime = require('mime');
require('dotenv').config();
var _storage = multer.diskStorage({
    destination: function(req, file, cb){
        if(file.fieldname == "noticeFile"){
            cb(null, 'uploads/noticeFiles/');
        } else if(file.fieldname == "reportFile"){
            cb(null, 'uploads/reportFiles/');
        } else {
            cb(null, 'uploads/')
        }
    },
    filename: function (req, file, cb){
        cb(null, file.originalname);
    }
})
var mysql = require('mysql2');

var db = mysql.createConnection({
    host : 'localhost',
    port : '3306',
    user : 'root',
    password : process.env.DB_SECRET,
    database : 'test_file'
})
db.connect();

var upload = multer({storage: _storage})
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use('/user',express.static('uploads'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.engine('ejs', require('ejs').__express);

app.get('/', function(req, res){
    db.query('SELECT * FROM file', (err, result) => {
        res.render('index', {file : result });
    })
})

app.post('/files', (req, res) => {

    var zip = new AdmZip();
    var post = req.body;
    
    //파일이 하나일 경우 추가 해야
    for(var i = 0; i < post.files.length; i++){
        zip.addLocalFile(__dirname + "/uploads/" + post.files[i]);
    }

    var downloadName = `${Date.now()}.zip`;

    var data = zip.toBuffer();

    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename=${downloadName}`);
    res.set('Content-Length', data.length);
    res.send(data);
})

app.delete('/file/:file_id', (req, res) => {
    db.query(`DELETE FROM file WHERE id=?`, req.params.file_id, (err, result) => {
        if(err) throw err;
        res.send("파일이 삭제 되었습니다!");
    })
})

app.get('/file/:file_id', (req, res) => {
    try{
        db.query(`SELECT path FROM file WHERE id=?`, req.params.file_id, (err, result) => {
            if(err) throw err;
            var file = __dirname + "/uploads/" + result[0].path;

            
            if(fs.existsSync(file)){
                var filename = path.basename(file);
                var mimetype = mime.getType(file);

                res.setHeader('Content-disposition', 'attachment; filename=' + filename);
                res.setHeader('Content-type', mimetype);

                var filestream = fs.createReadStream(file);
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

app.put('/file/:file_id', upload.single('userfile'), (req, res) => {
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

app.get('/report/files/:report_id', (req, res) => {
    db.query(`SELECT id, path FROM file WHERE report_id=?`, req.params.report_id, (err, result) => {
        if(err) throw err;
        res.json(result);
    })
})

app.post('/report/files/:report_id', upload.single('reportFile'), function(req, res){
    db.query(`INSERT INTO file (path, report_id) VALUES(?, ?)`, [req.file.filename, req.params.report_id], function (err, result){
        if(err) throw err;
        res.send('Uploaded: ' + req.file.filename +
        '<br> <a href="/">HOME</a> ');
    })
})

app.get('/notice/files/:notice_id', (req, res) => {
    db.query(`SELECT id, path FROM file WHERE notice_id=?`, req.params.notice_id, (err, result) => {
        if(err) throw err;
        res.json(result);
    })
})

app.post('/notice/files/:notice_id', upload.single('noticeFile'), function(req, res){
    db.query(`INSERT INTO file (path, notice_id) VALUES(?, ?)`, [req.file.filename, req.params.notice_id], function(err, result){
        if(err) throw err;
        res.send('Uploaded: ' + req.file.filename + 
        '<br> <a href="/">HOME</a>');
    })
})


app.listen(3000, () => {
    console.log('server running on 3000');
});