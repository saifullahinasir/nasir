const mongoose = require('mongoose');

const CrimeReportSchema = new mongoose.Schema({
  reporterName: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  imagePath: { type: String },    // Path to the stored image file
  videoPath: { type: String },     // Path to the stored video file
  audioPath: { type: String }      // Path to the stored audio file
});

module.exports = mongoose.model('CrimeReport', CrimeReportSchema);
