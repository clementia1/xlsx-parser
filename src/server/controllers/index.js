if (typeof require !== 'undefined') XLSX = require('xlsx');
const express = require('express');
// const upload = require('./upload.js');
const router = express.Router();
const path = require('path');
let multer  = require('multer');
let formatAddress = require('../utils/formatAddress.js');
let deleteCols = require('../utils/deleteCols.js');
let deleteRows = require('../utils/deleteRows.js');

let storage = multer.diskStorage({
  destination: path.join(__dirname, '..', '..', '..', 'build'),
  filename: function (req, file, cb) {
    cb(null, 'rawdata')
  }
})
let upload = multer({ storage: storage });

// router.post('/upload', upload.uploadSpreadsheet);
router.post('/upload', upload.single('file'), function (req, res, next) {
	let workbook = XLSX.readFile(req.file.path);
	let sheet = workbook.Sheets[workbook.SheetNames[0]];
	let json = XLSX.utils.sheet_to_json(sheet);
		
	function removeDuplicates() {
		for (let i = 0; i < json.length - 1; i++) {
				let duplicatesInSequence = 0;
				let cell = sheet['D' + i];
				let test = sheet['B' + i];
				let nextCell = sheet['D' + (i + 1)];
				if (cell != undefined & nextCell != undefined) {
					while (sheet['D' + i].v === sheet['D' + (i + 1 + duplicatesInSequence)].v) {
						duplicatesInSequence++;	
						// console.log(test.v, cell.v, nextCell.v, i);
					}
					deleteRows(sheet, i, duplicatesInSequence);
				}
			}
	}
	
	function updateAddress() {
		let json = XLSX.utils.sheet_to_json(sheet);
		for (let i = 0; i < json.length + 10; i++) {
			let cell = sheet['H' + i];
			if (cell != undefined) {
				cell.v = formatAddress(cell.v);
				// console.log(cell.v);
			}
		}
	}
	
	function removeEmptyPhones() {
		let json = XLSX.utils.sheet_to_json(sheet);
		let indexArray = [];
		let j = 0;
		for (let i = 1; i < json.length + 2; i++) {			
			if (typeof sheet['G' + i] === 'undefined') {				
				indexArray.push(i);
			}
		}
		indexArray.forEach(item => {
				deleteRows(sheet, item - 1 + j, 1);
				j--;
		})		
	}
	
	if (req.query.removeDuplicates == 'true') {
		removeDuplicates();
	}
	if (req.query.formatAddress == 'true') {
		updateAddress();
	}
	if (req.query.removeEmptyPhones == 'true') {
		removeEmptyPhones();
	}
	deleteCols(sheet, 9, 1);
	deleteCols(sheet, 0, 1);
	sheet['A1'].v = 'Номер вакансії';
	sheet['B1'].v = 'Роботодавець';
	sheet['C1'].v = 'Посада';
	sheet['D1'].v = 'Заробітна плата';
	sheet['E1'].v = "Завдання та обов'язки";
	sheet['F1'].v = 'Телефон відділу кадрів';
	sheet['G1'].v = 'Фактична адреса';
	XLSX.writeFile(workbook, path.join(__dirname, '..', '..', '..', 'build', 'result.xls'));
	res.send('job done');
})

module.exports = router;
