// middleware/uploadMemory.js
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // optional: 5 MB limit
});

module.exports = upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'partySymbol', maxCount: 1 }
]);
