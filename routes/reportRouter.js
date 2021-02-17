const express = require('express');
const router = express.Router();
const FileController = require('../controller/report-controller');
const { TokenValidation } = require('../middlewares/verifyToken');

router.put('/:file_id', TokenValidation, FileController.modifyReportFile);
router.delete('/:file_id', TokenValidation, FileController.deleteFile);
router.get('/:file_id', FileController.downloadReportFile);

router.get('/files/:report_id', FileController.getReportFile);
router.post(
  '/files/:report_id',
  TokenValidation,
  FileController.uploadReportFile
);
module.exports = router;
