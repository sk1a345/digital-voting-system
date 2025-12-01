const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true,
  }
});

// Hash the password before saving the admin:

adminSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
})

// compare password method:
adminSchema.methods.comparePassword = function(enteredPassword){
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('AdminInfo',adminSchema);