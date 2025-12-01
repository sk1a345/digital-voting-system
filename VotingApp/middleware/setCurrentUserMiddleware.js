const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Admin= require('../models/admin');

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME || "authToken";

module.exports.setCurrentUser = async (req,res,next) =>{
  try{
    const token = req.cookies[COOKIE_NAME]; // <-- read JWT
    if(!token){
      req.user = null;
      return next();
    }
    const decoded = jwt.verify(token,JWT_SECRET); // <-- read JWT
    if(decoded.role === 'user'){
      req.user = await User.findById(decoded.userId).lean(); // <-- fetch user store user in request
      req.user.role= "user"; // <-- for EJS set the user's role as user 
    }else{
      req.user = await Admin.findById(decoded.userId).lean();
      req.user.role = "admin";//set the user's role as the admin;
    }
  }catch(err){
    req.user = null;//invalid token or expired
  }
  next();
} 