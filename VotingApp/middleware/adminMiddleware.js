const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = process.env.COOKIE_NAME || 'authToken';

module.exports.protectAdmin = (req,res,next) =>{
  try{
    const token = req.cookies[COOKIE_NAME];

    if(!token){
      return res.redirect('/admin/login');
    }
    // Verify the token:
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if the user has admin role:
    if(decoded.role !== 'admin'){
      return res.status(403).send('Access denied. Admins only please.');
    }
    // Attach the user info to request the object:
    req.user = decoded;
    next();
  }catch(err){
    console.log("Admin Authentication Error: ",err);
    return res.redirect('/admin/login');
  }
}