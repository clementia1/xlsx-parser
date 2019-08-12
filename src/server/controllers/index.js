if (typeof require !== 'undefined') XLSX = require('xlsx');

const express = require('express');
// const upload = require('./upload.js');
const router = express.Router();
let multer  = require('multer');

let storage = multer.diskStorage({
  destination: '../../build/',
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

let upload = multer({ storage: storage });

// router.post('/upload', upload.uploadSpreadsheet);
router.post('/upload', upload.single('file'), function (req, res, next) {
	
	let workbook = XLSX.read(req.file.path);
	let sheet = workbook.Sheets[workbook.SheetNames[0]];
	let json = XLSX.utils.sheet_to_json(sheet);
	console.log(req.file.path, json);
})

module.exports = router;
