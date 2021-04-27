const jwt = require('jsonwebtoken');

const TokenValidation = (req, res, next) => {
  try {
    const token = req.header('Authorization');
    console.log(token);
    if (!token || typeof token !== 'string') {
      return res.status(401).json('Unauthorized');
    }
    const splitToken = token.split(' ');
    if (splitToken[0] !== 'Bearer') {
      return res.status(401).json('Unauthorized');
    }
    const payload = jwt.verify(splitToken[1], process.env.JWT_SECRET);
    req.payload = payload;

    next();
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      return res.status(410).json('Gone');
    }
    return res.status(401).json(e);
  }
};

module.exports = { TokenValidation };
