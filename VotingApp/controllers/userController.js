const User = require('../models/user');
const Candidate = require('../models/candidate');

module.exports.getIndex = (req, res) => {
  res.render("user", {
    currentPage: "",
  });
};
const crypto = require("crypto");

// decrypt method to decrypt the aadhar number 
function decryptAadhaar(encryptedText) {
  const [ivHex, encrypted] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.AADHAAR_SECRET_KEY),
    iv
  );

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

module.exports.getUserDashboard = async (req, res, next) => {
  try {
    const id = req.user.userId;
    const user = req.user;
    const final_user = await User.findById(id).lean();

    // decrypt Aadhaar before sending to view
    // console.log(user);
    const decryptedAadhaar = decryptAadhaar(final_user.aadhaarNumber);
    // Mask Aadhaar like DigiLocker
    const maskedAadhaar = "XXXX-XXXX-" + decryptedAadhaar.slice(-4);
    res.render("users/dashboard", {
      pageTitle: "User Dashboard",
      currentPage: "user-dash",
      user,
      final_user,
      aadhaar: maskedAadhaar
    });
  } catch (err) {
    console.log("Error loading user dashboard:", err);
    next(err);
  }
};

module.exports.getProfile = async (req,res,next) =>{
  const user = req.user;
  const id = req.user.userId;
  const final_user = await User.findById(id).lean();
  const dcryaadhar = decryptAadhaar(final_user.aadhaarNumber);
  const maskedAadhaar = "XXXX-XXXX-"+dcryaadhar.slice(-4);
  res.render('users/profile',{
    pageTitle: "Profile",
    currentPage: "profile",
    maskedAadhaar,
    user,
    finalUser: final_user,
  })
}


// handelling the get and post reqeust of the vote pages:


module.exports.getVotePage = async (req, res, next) => {
  try {
    const userId = req.user && req.user.userId;
    // console.log('GET /users/vote - req.user:', req.user);

    if (!userId) {
      // console.warn('getVotePage: no userId in req.user');
      return res.status(401).send('Not authenticated');
    }

    const user = await User.findById(userId);
    if (!user) {
      // console.warn('getVotePage: user not found for id', userId);
      return res.status(404).send('User not found');
    }

    if (user.votedFor) {
      return res.redirect('/users/dashboard');
    }

    const candidates = await Candidate.find({ isActive: true }).lean();
    return res.render('users/vote', {
      pageTitle: 'Vote',
      currentPage: 'vote',
      candidates
    });

  } catch (err) {
    // console.error('Error in getVotePage:', err);
    return res.status(500).send('Internal Server error');
  }
};

module.exports.postvotePage = async (req, res, next) => {
  try {
    const userId = req.user && req.user.userId;
    const candidateId = req.params.candidateId; // route param
    // console.log('POST /users/vote/:candidateId - req.user:', req.user, 'params:', req.params, 'body:', req.body);

    if (!userId) {
      // console.warn('postvotePage: no userId in req.user');
      return res.status(401).send('Not authenticated');
    }
    if (!candidateId) {
      // console.warn('postvotePage: no candidateId in req.params');
      return res.status(400).send('No candidate specified');
    }

    const user = await User.findById(userId);
    if (!user) {
      // console.warn('postvotePage: user not found for id', userId);
      return res.status(404).send('User not found');
    }

    if (user.votedFor) {
      return res.redirect('/users/dashboard'); // already voted
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      // console.warn('postvotePage: candidate not found for id', candidateId);
      return res.status(404).send('Candidate not found');
    }
    if (!candidate.isActive) {
      // console.warn('postvotePage: candidate is not active:', candidateId);
      return res.status(400).send('Candidate is not active');
    }

    // increment vote atomically
    await Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } });

    // mark user as voted
    user.votedFor = candidateId;
    await user.save();

    return res.redirect('/users/dashboard');

  } catch (err) {
    console.error('Error in postvotePage:', err);
    return res.status(500).send('Internal Server Error');
  }
};
