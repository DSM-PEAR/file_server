const db = require('../models');
const config = require('../config/multer');

exports.deleteFile = async (req, res) => {
    db.notice_tbl.findOne({
        where: {
            id: req.params.file_id
        }
    })
    .then(result => {
        var file = process.cwd() + "/uploads/noticeFiles/" + result.path;
        config.fs.unlinkSync(file);

        db.notice_tbl.destroy({
            where: {
                id: req.params.file_id
            }
        })
        res.json(success);
    })
    .catch(err => res.json(err));
}

exports.downloadNoticeFile = async (req, res) => {
    db.notice_tbl.findOne({
        where: {
            id: req.params.file_id
        }
    }).then(result => {
        var file = process.cwd() + "/uploads/noticeFiles/" + result.path;
        if(config.fs.existsSync(file)){
            var filename = config.path.basename(file);
            var mimetype = config.mime.getType(file);

            res.setHeader('Content-disposition', 'attachment; filename=' + filename);
            res.setHeader('Content-type', mimetype);

            var filestream = config.fs.createReadStream(file);
            filestream.pipe(res);
        } else {
            res.send('해당 파일이 없습니다.');
            return;
        }
    }).catch(error => {
        console.log(error);
        res.send('파일을 다운로드하는 중에 에러가 발생하였습니다.');
        return;
    })
}

exports.getNoticeFile = async (req, res) => {
    if(!Number.isInteger(parseInt(req.params.notice_id))) {
        res.status(400).send("notice_id 다시 확인해주세요.")
        return 400;
    }

    db.notice_tbl.findAll({
        attributes: ['id', 'path'],
        where: {
            notice_id: req.params.notice_id,
        }
    })
    .then(result => {
        if(result[0] === undefined) {
            res.status(404).send("File not found");
        } else {
            res.json(result);
            return {
                result: result,
                response: res
            };
        }
    })
    .catch(err => res.json(err));
}

exports.uploadNoticeFile = async (req, res) => {
    db.notice_tbl.create({
        path : req.file.filename,
        notice_id : req.params.notice_id
    }).then(result => res.json(result))
    .catch(err => res.json(err));
}

exports.modifyNoticeFile = async (req, res) => {
    db.notice_tbl.findOne({
        where: {
            id: req.params.file_id
        }
    })
    .then(find => {
        deleteFile(find.id);

        db.notice_tbl.update({
            path: req.file.filename,
        }, {
            where: {
                id: req.params.file_id,
            }
        }).then(result => res.json(result))
        .catch(err => res.json(err));

        res.send("PUT SUCCESS");
    })
    .catch(err => res.json(err));
}