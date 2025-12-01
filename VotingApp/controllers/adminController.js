// Rendering the admin dashboard
const Candidate = require('../models/candidate');

module.exports.getAdminDashboard = (req,res,next) =>{
  // console.log("Admin Dashboard accessed");
  res.render('admin/dashboard',{
    pageTitle: 'Admin Dashboard',
    currentPage: 'Admin-dashboard'
  })
}
module.exports.getAddCandidate = (req,res,next) =>{
  res.render('admin/addCandidate',{
    pageTitle: 'Add-Candidate',
    currentPage: 'Add-Candidate'
  })
}
module.exports.getMessage = (req,res,next) =>{
  res.render('admin/message',{
    pageTitle: 'success-message'
  })
}
module.exports.getDeleteCandidate = async (req,res,next) =>{
  try{
    const candidates = await Candidate.find();
    res.render('admin/deleteCandidate',{
    pageTitle: "Delete-Candidate",
    currentPage: 'Delete-Candidate',
    candidates: candidates
  })
  }catch(err){
    console.log("Error Internal error in getDeleteCandiates");
    next(err);
  }
  
}
// Deleting the candidates:
module.exports.postDeleteCandidate = async(req,res,next) =>{
  try{
    const candidateId = req.params.id;
    await Candidate.findByIdAndDelete(candidateId);
    res.redirect("/admin/message");
  }catch(err){
    console.log("Error while Deleting the candidate: ",err);
    res.status(500).send("Internal Server Error");
  }
}
// Handelling the post request for addCandidate;
// controllers/adminController.js
const cloudinary = require('../utils/cloudinary');


// helper to upload buffer to cloudinary (returns result)
function uploadBufferToCloudinary(buffer, folder, filename) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: filename, resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

module.exports.postAddCandidate = async (req, res) => {
  try {
    const { name, party } = req.body;

    // Basic validation
    if (!name || !party) {
      return res.status(400).send('Name and party are required');
    }

    // files in memory (from multer memory storage)
    const photoFile = req.files?.photo?.[0];
    const symbolFile = req.files?.partySymbol?.[0];

    if (!photoFile || !symbolFile) {
      return res.status(400).send('Both candidate photo and party symbol are required');
    }

    // upload both files to Cloudinary (choose folder names)
    const timestamp = Date.now();
    const photoUpload = await uploadBufferToCloudinary(photoFile.buffer, 'votingapp/candidates', `candidate_${timestamp}`);
    const symbolUpload = await uploadBufferToCloudinary(symbolFile.buffer, 'votingapp/party_symbols', `symbol_${timestamp}`);

    // Save candidate with secure URLs
    const candidate = await Candidate.create({
      name: name.trim(),
      party: party.trim(),
      photo: photoUpload.secure_url,
      partySymbol: symbolUpload.secure_url,
      votes: 0
    });

    // after success redirect to admin dashboard
    return res.redirect('/admin/dashboard');
  } catch (err) {
    console.error('Error adding candidate:', err);
    return res.status(500).send('Internal server error');
  }
};

module.exports.getCandidates = async (req,res,next)=>{
  // Fetching the candidates from the database:
  try{
    // Fetch the candidates from the Mongodb
    const candidates = await Candidate.find();
    // Rendert the EJS page and pass the candidates:
    res.render('admin/candidates',{
      pageTitle: "All Candidates",
      currentPage: "candidates",
      candidates: candidates
    });
  }catch (err){
    console.log("Error while fetching the candidates: ",err);
    next(err);
  }
}

// Enable Candidate:
module.exports.enableCandidate = async (req,res,next) =>{
  try{
    const id = req.params.id;
    await Candidate.findByIdAndUpdate(id, {isActive: true});
    res.redirect('/admin/candidates');
  }catch (err){
    console.log("Error Enabling the candidate: ",err);
    next(err);
  }
};

// Disavke the Candidate:
module.exports.disableCandidate = async (req,res,next)=>{
  try{
    const id = req.params.id;
    await Candidate.findByIdAndUpdate(id, {isActive: false});
    res.redirect('/admin/candidates');
  }catch(err){
    console.log("Error while Enabling the Candidate: ",err);
    next(err);
  }
}