import React, {useState, useMemo} from 'react';
import {useDropzone} from 'react-dropzone';
import request from 'superagent';
import Select from 'react-select';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '50px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

function Basic(props) {
    const {
	acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
		accept: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		onDrop: files => onDrop(files)
	  });
  const [xlsReady, setReadyXls] = useState(false);
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [formatAddress, setFormatAddress] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [removeByDuties, setRemoveByDuties] = useState(true);
  const [selectedRemoveEmpty, onSelectEmptyChange] = useState([
	  { value: 'Телефон відділу кадрів / Оперативні вакансії', label: 'Телефону' }
	]);
  const [selectedDuties, onSelectByDuties] = useState([
	  { value: "*", label: "Символ * на початку строки" },
	  { value: "рекрутер", label: "Слово «рекрутер» або «рекрутинг»" },
	  { value: "при собі мати резюме", label: "Фразу «при собі мати резюме»" }
   ]);
	
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} байт { xlsReady ? <a href="/result.xls" className="btn btn-success custom-margin" role="button">Скачать</a> :  <button type="button" className="btn btn-secondary custom-margin" disabled>Скачать</button> }
    </li>
  ));

function onDrop(acceptedFiles) {
	setReadyXls(false);
	const req = request.post('/upload')
	acceptedFiles.forEach(file => {
		req.attach('file', file)
		console.log(file)
	})
	req.query('removeDuplicates=' + removeDuplicates);
	req.query('formatAddress=' + formatAddress);
	req.query('removeEmpty=' + removeEmpty);
	req.query('removeByDuties=' + removeByDuties);
	req.field("removeOptions", JSON.stringify(selectedRemoveEmpty)); 
	req.field("removeByDutiesOptions", JSON.stringify(selectedDuties)); 
	req.end(function(err, res){
		console.log(res.text);
		setReadyXls(true);
	});
}

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject
  ]);

	const options = [
	  { value: "Телефон відділу кадрів / Оперативні вакансії", label: "Телефону" },
	  { value: "Завдання та обов'язки / Характеристика вакансії", label: "Обов'язків" },
	  { value: "Фактична адреса ПОУ / Оперативні вакансії", label: "Фактичної адреси" }
	];
	const options2 = [
	  { value: "*", label: "Символ * на початку строки" },
	  { value: "рекрутер", label: "Слово «рекрутер» або «рекрутинг»" },
	  { value: "при собі мати резюме", label: "Фразу «при собі мати резюме»" }
	];

  return (
    <section className="container">
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <p>Перетягніть файл сюди або натисніть, щоб обрати файл</p>
      </div>
      <aside className="file-list">
        <h4>Обрано</h4>
        <div className="checkbox-block">
        
			<div className="form-check custom-margin">
				<input className="form-check-input" 
					type="checkbox" 
					checked={removeDuplicates} 
					onChange={() => setRemoveDuplicates(!removeDuplicates)} 
					id="checkbox1"
				/>
			  <label className="form-check-label" htmlFor="checkbox1">
				Видалити дублюючі вакансії — від одного роботодавця на одну і ту ж саму посаду
			  </label>
			</div>
			
			<div className="form-check custom-margin">
			  	<input className="form-check-input" 
					type="checkbox" 
					checked={formatAddress} 
					onChange={() => setFormatAddress(!formatAddress)} 
					id="checkbox2"
				/>
			  <label className="form-check-label" htmlFor="checkbox2">
				Покращити формат фактичної адреси ПОУ — привести її до виду: Місто, вулиця, № будинка. Видалити номер квартири/офісу, якщо присутній
			  </label>
			</div>

			<div className="form-check custom-margin">
			  	<input className="form-check-input" 
					type="checkbox" 
					checked={removeByDuties} 
					onChange={() => setRemoveByDuties(!removeByDuties)} 
					id="checkbox3"
				/>
			  <label className="form-check-label" htmlFor="checkbox3">
				Видалити вакансії, якщо «Завдання та обов'язки» містять
			  </label>
			    <Select
					defaultValue={options2}
					isMulti
					name="colors"
					closeMenuOnSelect={false}
					options={options2}
					className="basic-multi-select"
					classNamePrefix="select"
					onChange={(option) => onSelectByDuties(option)} 
				  />
			</div>
			
			<div className="form-check custom-margin">
			  	<input className="form-check-input" 
					type="checkbox" 
					checked={removeEmpty} 
					onChange={() => setRemoveEmpty(!removeEmpty)} 
					id="checkbox3"
				/>
			  <label className="form-check-label" htmlFor="checkbox3">
				Видалити вакансії, якщо порожнє значення
			  </label>
			    <Select
					defaultValue={[options[0]]}
					isMulti
					name="colors"
					closeMenuOnSelect={false}
					options={options}
					className="basic-multi-select"
					classNamePrefix="select"
					onChange={(option) => onSelectEmptyChange(option)} 
				  />
			</div>
		</div>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}

export default Basic;
