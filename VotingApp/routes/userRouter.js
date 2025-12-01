// External Modules:
const express = require('express');
const userRouter = express.Router();


const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const {protectUser} = require('../middleware/authMiddleware');  


// Define Routes:
userRouter.get('/this',userController.getIndex);
userRouter.get('/signup',authController.getUserSignup);
userRouter.get('/login',authController.getUserLogin);
userRouter.post('/login',authController.postUserLogin);
userRouter.post('/signup',authController.postUserSignup);
userRouter.get('/dashboard',protectUser,userController.getUserDashboard);
userRouter.get('/logout',protectUser, authController.getUserLogout);
userRouter.get('/profile',protectUser, userController.getProfile);
userRouter.get('/vote',protectUser, userController.getVotePage);
userRouter.post('/vote/:candidateId',protectUser,userController.postvotePage);


// Export the Router:
module.exports = userRouter;