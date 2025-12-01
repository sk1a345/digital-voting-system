// External Imports
const express = require('express');
const adminRouter = express.Router();

// Internal Imports
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/adminMiddleware');
const uploadMemory = require('../middleware/uploadMemory');


// Defining Routes
adminRouter.get('/login',authController.getAdminLogin);
adminRouter.post('/login',authController.postAdminLogin);
adminRouter.get('/dashboard', protectAdmin,adminController.getAdminDashboard);
adminRouter.get('/logout',protectAdmin, authController.getAdminLogout);

adminRouter.get('/candidates/add',protectAdmin,adminController.getAddCandidate);
adminRouter.post('/candidates/add',protectAdmin,uploadMemory,adminController.postAddCandidate);

adminRouter.get('/candidates',protectAdmin,adminController.getCandidates);

adminRouter.get('/candidates/delete',protectAdmin, adminController.getDeleteCandidate);

adminRouter.post('/candidates/delete/:id',protectAdmin,adminController.postDeleteCandidate);

adminRouter.get('/message',protectAdmin,adminController.getMessage);

//Enable Canidate:
adminRouter.post('/candidate/:id/enable',protectAdmin,adminController.enableCandidate);

// Disable Candidate:
adminRouter.post('/candidate/:id/disable',protectAdmin,adminController.disableCandidate);

// Exporting the adminRouter
module.exports = adminRouter;