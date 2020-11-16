const express = require('express');
const router = express.Router();
const db = require('../models');

router.get('/all', (req, res) => {
    db.notice_tbl.findAll().then(notice => res.send(notice));
});

router.get('/find/:id', (req, res) => {
    db.notice_tbl.findAll({
        where: {
            id: req.params.id
        }
    }).then(notice => res.send(notice));
});

router.post('/new', (req, res) => {
    db.notice_tbl.create({
        path: req.body.path,
        notice_id: req.body.notice_id
    }).then( submittedNotice => res.send(submittedNotice));
});

router.delete('/delete/:id', (req, res) => {
    db.notice_tbl.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => res.send("success"));
});

router.put('/edit/:id', (req, res) => {
    db.notice_tbl.update(
        {
            path: req.body.path,
            notice_id: req.body.notice_id
        }, 
        {
            where: { id: req.params.id }
        }
    ).then(() => res.send("edited"));
});

module.exports = router;