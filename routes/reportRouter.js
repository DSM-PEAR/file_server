const express = require('express');
const router = express.Router();
const FileController = require('../controller/report-controller');

router.put('/:file_id', FileController.modifyReportFile);
router.delete('/:file_id', FileController.deleteFile);
router.get('/:file_id', FileController.downloadReportFile);

router.get('/files/:report_id', FileController.getReportFile);
router.post('/files/:report_id', FileController.uploadReportFile);
module.exports = router;