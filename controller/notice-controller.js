const db = require('../models');
const config = require('../config/multer');
const multer = require('multer');

exports.deleteFile = async (req, res) => {
  const noticeFile = await db.notice_tbl.findOne({
    where: {
      id: req.params.file_id,
    },
  });
  if (noticeFile === null) {
    res.status(404).send('파일이 존재하지 않습니다');
  }

  if (noticeFile.user_email !== req.payload.sub) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const filePath = process.cwd() + '/uploads/noticeFiles/' + noticeFile.path;
  console.log(filePath);
  config.fs.unlinkSync(filePath);

  await db.notice_tbl.destroy({
    where: {
      id: req.params.file_id,
    },
  });
  res.status(200).json({ message: 'File deleted' });
};

exports.downloadNoticeFile = async (req, res) => {
  const noticeFile = await db.notice_tbl.findOne({
    where: {
      id: req.params.file_id,
    },
  });
  if (!noticeFile) {
    return res.status(404).send('파일을 찾을 수 없습니다');
  }

  var file = process.cwd() + '/uploads/noticeFiles/' + noticeFile.path;
  if (config.fs.existsSync(file)) {
    var filename = config.path.basename(file);
    var mimetype = config.mime.getType(file);

    res.setHeader(
      'Content-disposition',
      'attachment; filename=' +
        config.iconv.decode(
          config.iconv.encode(filename, 'UTF-8'),
          'ISO-8859-1'
        )
    );
    res.setHeader('Content-type', mimetype);

    var filestream = config.fs.createReadStream(file);
    filestream.pipe(res);
  } else {
    return res.status(500).send('해당 파일이 없습니다.');
  }
};

exports.getNoticeFile = async (req, res) => {
  if (!Number.isInteger(parseInt(req.params.notice_id))) {
    return res.status(400).send('notice_id 다시 확인해주세요.');
  }

  const noticeFiles = await db.notice_tbl.findAll({
    attributes: ['id', 'path'],
    where: {
      notice_id: req.params.notice_id,
    },
  });

  if (noticeFiles[0] === undefined) {
    res.status(404).send('File not found');
  } else {
    res.json(noticeFiles);
  }
};

exports.uploadNoticeFile = async (req, res) => {
  config.upload.single('noticeFile')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      res.status(400).send('form name 다시 확인해주세요');
    } else if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    const newNoticeFile = await db.notice_tbl.create({
      path: req.file.filename,
      notice_id: req.params.notice_id,
      user_email: req.payload.sub,
    });
    res.status(201).json(newNoticeFile);
  });
};

exports.modifyNoticeFile = async (req, res) => {
  config.upload.single('noticeFile')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).send('form name 다시 확인해주세요');
    } else if (err) {
      consolee.log(err);
      return res.status(500).send(err);
    }

    const existFile = await db.notice_tbl.findOne({
      where: { id: req.params.file_id },
    });
    if (!existFile) {
      return res.status(404).json({ message: 'Not found file' });
    }

    if (existFile.user_email !== req.payload.sub) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await db.notice_tbl.update(
      {
        path: req.file.filename,
      },
      {
        where: {
          id: req.params.file_id,
        },
      }
    );
    return res.status(200).json({ message: 'File updated' });
  });
};
