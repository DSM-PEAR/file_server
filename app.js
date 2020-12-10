var express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');
var AdmZip = require('adm-zip');
require('dotenv').config();
var db = require('./models');

var reportRouter = require('./routes/reportRouter');
var noticeRouter = require('./routes/noticeRouter');
var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/user',express.static('uploads'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.engine('ejs', require('ejs').__express);

app.use('/report', reportRouter);
app.use('/notice', noticeRouter);

app.get('/', function(req, res){
    db.report_tbl.findAll().then((report_file) => {
        db.notice_tbl.findAll().then((notice_file) => {
            // console.log(report_file[0].id);
            res.render('index', {
                report_file : report_file,
                notice_file : notice_file,
            });
        });
    })
    /*db.query('SELECT * FROM file', (err, result) => {
        res.render('index', {file : result });
    })*/
})

app.get('/files', (req, res) => {

    var zip = new AdmZip();
    var post = req.query;
    var path = "";

    console.log(post);

    if(post.report_id !== undefined) path = "reportFiles/";
    else if(post.notice_id !== undefined) path = "noticeFiles/";
    
    if(Array.isArray(post.files)){
        for(var i = 0; i < post.files.length; i++){
            zip.addLocalFile(__dirname + `/uploads/${path}` + post.files[i]);
        }
    } else {
        res.send('두개이상 입력해주세요.');
    }

    var downloadName = `${Date.now()}.zip`;

    var data = zip.toBuffer();

    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename=${downloadName}`);
    res.set('Content-Length', data.length);
    res.send(data);
})

db.sequelize.sync().then(() => {
    app.listen(3000, () => {
        console.log('server running on port 3000');
    });
});