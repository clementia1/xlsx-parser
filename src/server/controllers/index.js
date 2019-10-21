if (typeof require !== 'undefined') XLSX = require('xlsx');
const express = require('express');
// const upload = require('./upload.js');
const router = express.Router();
const path = require('path');
let multer  = require('multer');
let formatAddress = require('../utils/formatAddress.js');
let removeByDuties = require('../utils/removeByDuties.js');
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
			
		json.forEach((item, i, arr) => {
				let duplicatesInSequence = 0;
				let cell = json[i];
				let nextCell = json[i + 1];
				if (cell != undefined && nextCell != undefined) {
						while (json[i + 1 + duplicatesInSequence] != undefined && json[i]['Посада (назва) / Характеристика вакансії'] === json[i + 1 + duplicatesInSequence]['Посада (назва) / Характеристика вакансії'] && json[i]['Роботодавець (назва) / Оперативні вакансії'] === json[i + 1 + duplicatesInSequence]['Роботодавець (назва) / Оперативні вакансії']) {
							duplicatesInSequence++;	
							// console.log(json[i + 1 + duplicatesInSequence]);
						}
					json.splice(i, duplicatesInSequence);
				}
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
	}
	
	function removeEmpty(target) {
		let json = XLSX.utils.sheet_to_json(sheet);
		json = json.filter(item => {
			if (item[target] == '' || item[target] == undefined) {
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
	}
	
	if (req.query.removeDuplicates == 'true') {
		removeDuplicates();
	}
	if (req.query.formatAddress == 'true') {
		updateAddress();
	}
	if (req.query.removeEmpty == 'true') {
		let options = JSON.parse(req.body.removeOptions);
		if (options != null && options != undefined) {
			options.forEach(item => {
					removeEmpty(item.value);
			})		
		}
	}
	
	if (req.query.removeByDuties == 'true') {
		let options = JSON.parse(req.body.removeByDutiesOptions);
		options = options.map(item => { return item.value});
		console.log(options);
		if (options != null && options != undefined) {
			let json = XLSX.utils.sheet_to_json(sheet);
			json = removeByDuties(json, options);
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
	}
	
	json = XLSX.utils.sheet_to_json(sheet, { blankrows: false, defval: '' });	
	json = json.map(item => {
		if (item.hasOwnProperty("Номер вакансії / Оперативні вакансії")) {
			Object.defineProperty(item, "Номер вакансії",
				Object.getOwnPropertyDescriptor(item, "Номер вакансії / Оперативні вакансії"));
			delete item["Номер вакансії / Оперативні вакансії"];
		}
		if (item.hasOwnProperty("Роботодавець (назва) / Оперативні вакансії")) {
			Object.defineProperty(item, "Роботодавець",
				Object.getOwnPropertyDescriptor(item, "Роботодавець (назва) / Оперативні вакансії"));
			delete item["Роботодавець (назва) / Оперативні вакансії"];
		}
		if (item.hasOwnProperty("Посада (назва) / Характеристика вакансії")) {
			Object.defineProperty(item, "Посада",
				Object.getOwnPropertyDescriptor(item, "Посада (назва) / Характеристика вакансії"));
			delete item["Посада (назва) / Характеристика вакансії"];
		}
		if (item.hasOwnProperty("Заробітна плата / Оперативні вакансії")) {
			Object.defineProperty(item, "Заробітна плата",
				Object.getOwnPropertyDescriptor(item, "Заробітна плата / Оперативні вакансії"));
			delete item["Заробітна плата / Оперативні вакансії"];
		}
		if (item.hasOwnProperty("Завдання та обов'язки / Характеристика вакансії")) {
			Object.defineProperty(item, "Завдання та обов'язки",
				Object.getOwnPropertyDescriptor(item, "Завдання та обов'язки / Характеристика вакансії"));
			delete item["Завдання та обов'язки / Характеристика вакансії"];
		}
		if (item.hasOwnProperty("Телефон відділу кадрів / Оперативні вакансії")) {
			Object.defineProperty(item, "Телефон відділу кадрів",
				Object.getOwnPropertyDescriptor(item, "Телефон відділу кадрів / Оперативні вакансії"));
			delete item["Телефон відділу кадрів / Оперативні вакансії"];
		}
		if (item.hasOwnProperty("Фактична адреса ПОУ / Оперативні вакансії")) {
			Object.defineProperty(item, "Фактична адреса",
				Object.getOwnPropertyDescriptor(item, "Фактична адреса ПОУ / Оперативні вакансії"));
			delete item["Фактична адреса ПОУ / Оперативні вакансії"];
		}
		return item
	});
	sheet = XLSX.utils.json_to_sheet(json, { header:
		["Номер вакансії",
		"Роботодавець",
		"Посада",
		"Заробітна плата",
		"Завдання та обов'язки",
		"Телефон відділу кадрів",
		"Фактична адреса"]
	});
	
	let wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, sheet);
	XLSX.writeFile(wb, path.join(__dirname, '..', '..', '..', 'build', 'result.xls'));
	res.send('job done');
})

module.exports = router;
