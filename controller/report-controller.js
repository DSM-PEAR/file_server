const db = require('../models');
const config = require('../config/multer');
const multer = require('multer');

exports.deleteFile = async (req, res) => {
    db.report_tbl.findOne({
        where: {
            id: req.params.file_id
        }
    })
    .then(result => {
        if(result === null) res.status(404).send("파일이 존재하지 않습니다");
        var file = process.cwd() + "/uploads/reportFiles/" + result.path;
        config.fs.unlinkSync(file);

        db.report_tbl.destroy({
            where: {
                id: req.params.file_id
            }
        })
        res.json(success);
    })
    .catch(err => res.json(err));
}

exports.downloadReportFile = async (req, res) => {
    db.report_tbl.findOne({
        where: {
            id: req.params.file_id
        }
    }).then(result => {
        var file = process.cwd() + "/uploads/reportFiles/" + result.path;
        if(config.fs.existsSync(file)){
            var filename = config.path.basename(file);
            var mimetype = config.mime.getType(file);

            res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            res.setHeader('Content-type', mimetype);

            var filestream = config.fs.createReadStream(file);
            filestream.pipe(res);
        } else {
            res.status(500).send('해당 파일이 없습니다.');
            return;
        }
    }).catch(error => {
        console.log(error);
        res.status(404).send('파일을 찾을 수 없습니다');
        return;
    })
}

exports.getReportFile = async (req, res) => {
    if(!Number.isInteger(parseInt(req.params.report_id))) {
        res.status(400).send("report_id 다시 확인해주세요.")
        return 400;
    }

    db.report_tbl.findAll({
        attributes: ['id', 'path'],
        where: {
            report_id: req.params.report_id,
        }
    })
    .then(result => {
        if(result[0] === undefined) {
            res.status(404).send("File not found");
        } else {
            res.json(result);
        }
    })
    .catch(err => res.json(err));
}

exports.uploadReportFile = async (req, res) => {
    config.upload.single('reportFile')(req, res, (err) => {
        if(err instanceof multer.MulterError){
            res.status(400).send("form name 다시 확인해주세요");
        } else if(err){
            console.log(err);
            res.status(500).send("문의주세요");
        }
        db.report_tbl.create({
        path : req.file.filename,
        report_id : req.params.report_id
        }).then(result => res.json(result))
        .catch(err => res.json(err));
    }
)}

exports.modifyReportFile = async (req, res) => {
    config.upload.single('reportFile')(req, res, (err) => {
        if(err instanceof multer.MulterError){
            res.status(400).send("form name 다시 확인해주세요");
        } else if(err){
            consolee.log(err);
            res.status(500).send("문의주세요");
        }
        console.log(req.params.file_id);
        db.report_tbl.update({
            path: req.file.filename,
        }, {
            where: {
                id: req.params.file_id,
            }
        }).then(() => res.send("PUT SUCCESS"))
        .catch(err => res.json(err));
    })
}