const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('./config');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({msg: "wrong inputs"});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if(decoded.userId){
           req.userId = decoded.userId;

           next();
        } else {
            return res.status(403).json({});
        }

    } catch (error) {
        return res.status(403).json({
            msg: "authorization failed. try again with correct inputs"
        });
    }
};

module.exports = authMiddleware;