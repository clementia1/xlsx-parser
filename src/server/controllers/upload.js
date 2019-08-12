const fs = require('fs');

if (typeof require !== 'undefined') XLSX = require('xlsx');

async function uploadSpreadsheet(req, res) {
	let workbook = XLSX.read(req.body);
	let sheet = workbook.Sheets[workbook.SheetNames[0]];
	let json = XLSX.utils.sheet_to_json(sheet);
	console.log(req.body);
};


exports.uploadSpreadsheet = uploadSpreadsheet;
