const jwt = require('jsonwebtoken');



const homeMiddleware = (req, res, next)=>{
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }
    const parts = authHeader.split(' ');

    const token  = parts[1];
    let decodedToken = jwt.verify(token, process.env.PRIVATE_KEY);
    req.userInfo = decodedToken;
    next();
}


const adminMiddleware = (req, res, next)=>{
    if(req.userInfo.role !== "admin"){
        return res.status(403).json({
            message: `sorry ${req.userInfo.username}, this page is for admin users only`
        })
    }
    next();
}

module.exports = {
    homeMiddleware, 
    adminMiddleware
}