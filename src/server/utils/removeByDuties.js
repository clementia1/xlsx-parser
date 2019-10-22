function removeByDuties(targetArray, options) {
	let resultArray = targetArray;
	if (options.includes('*')) {
		resultArray = resultArray.filter(item => {
			let targetField = item["Завдання та обов'язки / Характеристика вакансії"];
			if (targetField != undefined && targetField.charAt(0) == '*') {				
				return false
			}			
			return true
		});
	}
	
	if (options.includes('рекрутер')) {
		resultArray = resultArray.filter(item => {
			let targetField = item["Завдання та обов'язки / Характеристика вакансії"];
			if (targetField != undefined && targetField.match(/рекрутер|рекрутинг(\s|\.)/i) != null) {
				return false
			}			
			return true
		});
	}
	
	if (options.includes('при собі мати резюме')) {
		resultArray = resultArray.filter(item => {
			let targetField = item["Завдання та обов'язки / Характеристика вакансії"];
			if (targetField != undefined && targetField.match(/при собі мати резюме(\s|\.)/i) != null) {
				console.log('при собі мати резюме')
				return false
			}			
			return true
		});
	}
	
	return resultArray
}

module.exports = removeByDuties;
