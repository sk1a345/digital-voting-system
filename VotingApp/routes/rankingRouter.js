const express = require('express');
const rankRouter = express.Router();
const Candidate = require('../models/candidate');


// simple home route:
rankRouter.get('/',(req,res)=>{
  res.render('index',{
    title: "Welcome to Voting App",
    currentPage: "home"
  });
});

rankRouter.get('/ranking', async (req,res)=>{
  try{
    const candidates = await Candidate.find({isActive: true})
    .sort({votes: -1})//highest votes first
    .lean();

    res.render("ranking",{
      pageTitle: "Ranking",
      currentPage: 'ranking',
      candidates,
      user: req.user || null
    });
  }catch (err){
    console.log("Ranking page error: ",err);
    res.status(500).send("Internal server error");
  }

});
module.exports = rankRouter;
