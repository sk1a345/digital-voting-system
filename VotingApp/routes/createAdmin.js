const AdminInfo = require('../models/admin');
const express = require('express');
const router = express.Router();

router.get('/', async(req, res)=>{
  const admin = new AdminInfo({
    username: 'four-admin',
    password: 'ad@4minPass'
  });
  await admin.save();
  res.send('Admin created');
});
module.exports = router;

// first-admin: 'ad@1minPass'
// second-admin: 'ad@2minPass'
// third-admin: 'ad@3minPass'
// four-admin: 'ad@4minPass'
// 