require('dotenv').config();
// Core modules
const path = require('path');
// External modules


const express = require('express');

// Local modules
const userRouter = require('./routes/userRouter');
const adminRouter = require('./routes/adminRouter');
const {setCurrentUser} = require('./middleware/setCurrentUserMiddleware');
const rankRouter = require('./routes/rankingRouter');

// App initialization
const app = express();

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// // Local middleware to make user info available in all views
app.use(setCurrentUser);
app.use((req,res,next)=>{
  res.locals.user = req.user || null;
  next();
});
// Root Route (


// Routes
app.use('/',rankRouter);
app.use('/users', userRouter);
app.use('/admin',adminRouter);

// 404 Handler
app.use((req,res,next)=>{
  res.status(400).render('404',{currentPage:"",
    title: "Page Not Found"
  });
});

// Connecting to the database:

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  console.log("✅ Connected to MongoDB");
})
.catch(err =>{
  console.log("❌ Error while Connecting to the MongoDB", err);
})

// Port configuration
const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
