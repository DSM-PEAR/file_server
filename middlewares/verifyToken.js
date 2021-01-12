const jwt = require('jsonwebtoken');

const TokenValidation = (req, res, next) => {
    const token = req.header('Authorization');
    console.log(token);
    if(!token) return res.status(401).json('Access denied');

    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.payload = payload
        console.log(payload);
        
        next();
    } catch (err) {
        throw err;
    }
}

module.exports = { TokenValidation };