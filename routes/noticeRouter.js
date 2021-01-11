const express = require('express');
const router = express.Router();
const FileController = require('../controller/notice-controller');
const { TokenValidation } = require('../middlewares/verifyToken');

router.put('/:file_id', FileController.modifyNoticeFile);
router.delete('/:file_id', FileController.deleteFile);
router.get('/:file_id', FileController.downloadNoticeFile);

router.get('/files/:notice_id', FileController.getNoticeFile);
router.post('/files/:notice_id', FileController.uploadNoticeFile);
module.exports = router;