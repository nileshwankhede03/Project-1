const jwt = require("jsonwebtoken");

async function identifyUser(req , res , next) 
{
    const token = req.cookies.token;

    if(!token)
    {
        return res.status(401).json({
            message : "Token not provided, Unauthorized access"
        })
    }

    let decoded = null;
    try
    {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    }catch(e)
    {
        return res.status(401).json({
            message : "user not authorized"
        })
    }

    req.user = decoded; // add req.user property to forward id

    next();
}

module.exports = identifyUser;