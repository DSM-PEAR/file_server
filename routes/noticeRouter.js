const express = require('express');
const router = express.Router();
const FileController = require('../controller/file-controller');
const config = require('../config/multer');

router.put('/:file_id', config.upload.single('noticeFile'), FileController.modifyNoticeFile)
router.delete('/:file_id', FileController.deleteFile);
router.get('/:file_id', FileController.downloadNoticeFile);

router.get('/files/:notice_id', FileController.getNoticeFile);
router.post('/files/:notice_id', config.upload.single('noticeFile'), FileController.uploadNoticeFile);
module.exports = router;