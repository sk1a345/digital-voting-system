const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME || "authToken";

module.exports.protectUser = (req,res,next) =>{
  try{
    const token = req.cookies[COOKIE_NAME];
    
    if(!token){
      return res.redirect('/users/login');
    }

    // Verify the token:
    const decoded = jwt.verify(token,JWT_SECRET);

    // Attach the user info to request the object:
    req.user = decoded;
    next();
  }catch(err){
    console.log("Authentication Error",err);
    return res.redirect('/users/login');
  }
}