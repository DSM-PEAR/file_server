const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    describe('GET /', () => {
        it('should return 200 status code', () => {
            console.log('test');
        })
    })
})