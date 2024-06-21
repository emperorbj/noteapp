const jwt = require('jsonwebtoken')

function authenticateToken(req,res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401);

    jwt.verify(token,env.ACCESS_TOKEN_SECRET, (err,user) => {
        req.user = user;
        next();
    })
}

module.exports = {
    authenticateToken,
}