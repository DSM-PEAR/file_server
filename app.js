const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const AdmZip = require('adm-zip');
require('dotenv').config();
const db = require('./models');

const reportRouter = require('./routes/reportRouter');
const noticeRouter = require('./routes/noticeRouter');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/user', express.static('uploads'));
app.set('view engine', 'ejs');
app.set('views', './views');
app.engine('ejs', require('ejs').__express);

app.use('/report', reportRouter);
app.use('/notice', noticeRouter);

app.get('/', async (req, res) => {
  const report_file = await db.report_tbl.findAll();
  const notice_file = await db.notice_tbl.findAll();

  res.render('index', {
    report_file,
    notice_file,
  });
});

app.get('/upload', (req, res) => {
  res.render('upload');
});

app.get('/files', (req, res) => {
  var zip = new AdmZip();
  var post = req.query;
  var path = '';

  if (post.report_id !== undefined) path = 'reportFiles/';
  else if (post.notice_id !== undefined) path = 'noticeFiles/';

  if (Array.isArray(post.files)) {
    for (var i = 0; i < post.files.length; i++) {
      zip.addLocalFile(__dirname + `/uploads/${path}` + post.files[i]);
    }
  } else {
    res.status(400).send('2개 이상 입력해주세요.');
  }

  var downloadName = `${Date.now()}.zip`;

  var data = zip.toBuffer();

  res.set('Content-Type', 'application/octet-stream');
  res.set('Content-Disposition', `attachment; filename=${downloadName}`);
  res.set('Content-Length', data.length);
  res.send(data);
});

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('server running on port 3000');
  });
});
