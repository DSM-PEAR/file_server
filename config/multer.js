const multer = require('multer');
const path = require('path');
const mime = require('mime');
const iconv = require('iconv-lite');
const fs = require('fs');

const _storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname == 'noticeFile') {
      cb(null, 'uploads/noticeFiles/');
    } else if (file.fieldname == 'reportFile') {
      console.log(file.originalname);
      cb(null, 'uploads/reportFiles/');
    } else {
      cb(null, 'uploads/');
    }
  },
  filename: function (req, file, cb) {
    cb(null, `${new Date().valueOf()} ${file.originalname}`);
  },
});
const upload = multer({ storage: _storage });

module.exports = { upload, path, mime, fs, iconv };
