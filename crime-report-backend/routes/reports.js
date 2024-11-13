const express = require('express');
const multer = require('multer');
const path = require('path');
const CrimeReport = require('../models/CrimeReport');

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/', // Uploads folder for storing files
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file with timestamp
  }
});
const upload = multer({ storage });

// Route to submit a crime report
router.post('/submit', upload.fields([{ name: 'image' }, { name: 'video' }, { name: 'audio' }]), async (req, res) => {
  try {
    const { reporterName, category, description, location, date, time } = req.body;

    // Create new crime report with file paths if available
    const report = new CrimeReport({
      reporterName,
      category,
      description,
      location,
      date,
      time,
      imagePath: req.files['image'] ? req.files['image'][0].path : null,
      videoPath: req.files['video'] ? req.files['video'][0].path : null,
      audioPath: req.files['audio'] ? req.files['audio'][0].path : null
    });

    await report.save();
    res.status(201).json({ message: 'Report submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, could not submit report.' });
  }
});

// Route to get all reports
router.get('/reports', async (req, res) => {
  try {
    const reports = await CrimeReport.find();
    res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, could not retrieve reports.' });
  }
});

module.exports = router;
