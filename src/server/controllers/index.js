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
	let json = XLSX.utils.sheet_to_json(sheet, { blankrows: false, defval: '' });
	
	json = json.map(item => {
		if (item.hasOwnProperty('ОВ')) {
			delete item['ОВ']
			if (item.hasOwnProperty('__EMPTY')) {
				delete item['__EMPTY']
				return item
			}
			return item
		}
		return item
	});
	
	sheet = XLSX.utils.json_to_sheet(json, { header:
			["Номер вакансії / Оперативні вакансії",
			"Роботодавець (назва) / Оперативні вакансії",
			"Посада (назва) / Характеристика вакансії",
			"Заробітна плата / Оперативні вакансії",
			"Завдання та обов'язки / Характеристика вакансії",
			"Телефон відділу кадрів / Оперативні вакансії",
			"Фактична адреса ПОУ / Оперативні вакансії"]
	});
	
	function removeDuplicates() {
		let json = XLSX.utils.sheet_to_json(sheet, { blankrows: false, defval: '' });
		//~ for (let i = 1; i < json.length - 1; i++) {
				//~ let duplicatesInSequence = 0;
				//~ let cell = sheet['D' + i];
				//~ let test = sheet['B' + i];
				//~ let nextCell = sheet['D' + (i + 1)];
				//~ if (cell != undefined && nextCell != undefined) {
					//~ while (sheet['D' + (i + 1 + duplicatesInSequence)] != undefined && sheet['D' + i].v === sheet['D' + (i + 1 + duplicatesInSequence)].v) {
						//~ duplicatesInSequence++;	
						//~ // console.log(test.v, cell.v, nextCell.v, i);
					//~ }
					//~ deleteRows(sheet, i, duplicatesInSequence);
				//~ }
			//~ }
			
		json.forEach((item, i, arr) => {
				let duplicatesInSequence = 0;
				let cell = json[i];
				let nextCell = json[i + 1];
				if (cell != undefined && nextCell != undefined) {
						while (json[i + 1 + duplicatesInSequence] != undefined && json[i]['Посада (назва) / Характеристика вакансії'] === json[i + 1 + duplicatesInSequence]['Посада (назва) / Характеристика вакансії'] && json[i]['Роботодавець (назва) / Оперативні вакансії'] === json[i + 1 + duplicatesInSequence]['Роботодавець (назва) / Оперативні вакансії']) {
							duplicatesInSequence++;	
							console.log(json[i + 1 + duplicatesInSequence]);
						}
					json.splice(i, duplicatesInSequence);
				}
		}); 
		//~ let duplicatesIndexes = [];
				//~ let cell = json[i];
				//~ let nextCell = json[i + 1];
				//~ if (cell != undefined && nextCell != undefined) {
						//~ for (let j = 0; j < json.length; j++) {							
							//~ if (json[i]['Посада (назва) / Характеристика вакансії'] === json[j]['Посада (назва) / Характеристика вакансії'] && json[i]['Роботодавець (назва) / Оперативні вакансії'] === json[j]['Роботодавець (назва) / Оперативні вакансії']) {
								//~ duplicatesIndexes.push(j);	
								//~ console.log(json[j]['Роботодавець (назва) / Оперативні вакансії']);
								//~ json.splice(j, 1)
							//~ }
						//~ }
					//~ if (duplicatesIndexes.length > 1) {
						//~ duplicatesIndexes.forEach(item => {
							//~ console.log(item);
							//~ json.splice(item, 1)
						//~ })
					//~ }
				//~ }
		//~ }); 
		sheet = XLSX.utils.json_to_sheet(json, { header:
			["Номер вакансії / Оперативні вакансії",
			"Роботодавець (назва) / Оперативні вакансії",
			"Посада (назва) / Характеристика вакансії",
			"Заробітна плата / Оперативні вакансії",
			"Завдання та обов'язки / Характеристика вакансії",
			"Телефон відділу кадрів / Оперативні вакансії",
			"Фактична адреса ПОУ / Оперативні вакансії"]
		});
	}
	
	function updateAddress() {
		let json = XLSX.utils.sheet_to_json(sheet);
		json = json.map(item => {
			if (item['Фактична адреса ПОУ / Оперативні вакансії'] != undefined && item['Фактична адреса ПОУ / Оперативні вакансії'] != '') {
				item['Фактична адреса ПОУ / Оперативні вакансії'] = formatAddress(item['Фактична адреса ПОУ / Оперативні вакансії'])
				return item
			}
			return item
		});	
		sheet = XLSX.utils.json_to_sheet(json, { header:
			["Номер вакансії / Оперативні вакансії",
			"Роботодавець (назва) / Оперативні вакансії",
			"Посада (назва) / Характеристика вакансії",
			"Заробітна плата / Оперативні вакансії",
			"Завдання та обов'язки / Характеристика вакансії",
			"Телефон відділу кадрів / Оперативні вакансії",
			"Фактична адреса ПОУ / Оперативні вакансії"]
			});
		//~ for (let i = 0; i < json.length + 10; i++) {
			//~ let cell = sheet['H' + i];
			//~ if (cell != undefined) {
				//~ cell.v = formatAddress(cell.v);
				//~ // console.log(cell.v);
			//~ }
		//~ }
	}
	
	function removeEmptyPhones() {
		let json = XLSX.utils.sheet_to_json(sheet);
		json = json.filter(item => {
			if (item['Телефон відділу кадрів / Оперативні вакансії'] == '' || item['Телефон відділу кадрів / Оперативні вакансії'] == undefined) {
				return false
			}			
			return true
		});
		sheet = XLSX.utils.json_to_sheet(json, { header:
			["Номер вакансії / Оперативні вакансії",
			"Роботодавець (назва) / Оперативні вакансії",
			"Посада (назва) / Характеристика вакансії",
			"Заробітна плата / Оперативні вакансії",
			"Завдання та обов'язки / Характеристика вакансії",
			"Телефон відділу кадрів / Оперативні вакансії",
			"Фактична адреса ПОУ / Оперативні вакансії"]
		});
		//~ let json = XLSX.utils.sheet_to_json(sheet);
		//~ let indexArray = [];
		//~ let j = 0;
		//~ for (let i = 1; i < json.length + 2; i++) {			
			//~ if (typeof sheet['G' + i] === 'undefined') {				
				//~ indexArray.push(i);
			//~ }
		//~ }
		//~ indexArray.forEach(item => {
				//~ deleteRows(sheet, item - 1 + j, 1);
				//~ j--;
		//~ })		
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
	sheet['A1'].v = 'Номер вакансії';
	sheet['B1'].v = 'Роботодавець';
	sheet['C1'].v = 'Посада';
	sheet['D1'].v = 'Заробітна плата';
	sheet['E1'].v = "Завдання та обов'язки";
	sheet['F1'].v = 'Телефон відділу кадрів';
	sheet['G1'].v = 'Фактична адреса';
	let wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, sheet);
	XLSX.writeFile(wb, path.join(__dirname, '..', '..', '..', 'build', 'result.xls'));
	res.send('job done');
})

module.exports = router;
