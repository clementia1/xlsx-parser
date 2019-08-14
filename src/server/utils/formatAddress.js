function formatAddress(str) {
	if (str != undefined) {
		let newString = str.replace(/вул\./i, ' вулиця ');
		newString = newString.replace(/(пр-т|пр|просп)(\s|\.)/i, ' проспект ');
		newString = newString.replace(/пров(\s|\.)/i, ' провулок ');
		newString = newString.replace(/м-н(\s|\.)/i, ' майдан ');
		newString = newString.replace(/наб(\s|\.)/i, ' набережна ');
		newString = newString.replace(/Харківська область, Харків, НОВОБАВАРСЬКИЙ/i, 'Харків');
		newString = newString.replace(/Харківська область, Харків, ІНДУСТРІАЛЬНИЙ/i, 'Харків');
		newString = newString.replace(/Харківська область, Харків, Київський/i, 'Харків');
		newString = newString.replace(/Харківська область, Харків, ОСНОВ'ЯНСЬКИЙ/i, 'Харків');
		newString = newString.replace(/Харківська область, Харків, НЕМИШЛЯНСЬКИЙ/i, 'Харків');
		newString = newString.replace(/Харківська область, Харків, ХОЛОДНОГІРСЬКИЙ/i, 'Харків');
		newString = newString.replace(/Харківська область, Харків, ШЕВЧЕНКІВСЬКИЙ/i, 'Харків');
		newString = newString.replace(/Харківська область, Харків, СЛОБІДСЬКИЙ/i, 'Харків');
		newString = newString.replace(/Харківська область, Харків, Московський/i, 'Харків');
		newString = newString.replace(/(проспект).+(Московський)/i, 'Московський проспект');
		newString = newString.replace(/(вулиця).+(Ярослава).+(Мудрого)/i, 'Ярослава Мудрого вулиця');
		newString = newString.replace(/Харківська область,/i, '');
		
		let strArray = newString.split(',');
		if (strArray[0] == 'Харків') {
			strArray.splice(3);
		}
		strArray = strArray.map((item, i, arr) => {
			if (arr[0] =='Харків') {
				item = item.replace(/вулиця/i,'').trim();
				arr[1] = 'вулиця ' + arr[1];
				if (arr[2] != undefined) {
					arr[2] = arr[2].replace(/.*\D(?=\d)|\D+$/g, "");
				}
			}
			return item
		})

		newString = strArray.join(', ');
		newString = newString.replace('  ', ' ');
		return newString;
	}
}

module.exports = formatAddress;
