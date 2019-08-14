import React, {useState, useMemo} from 'react';
import {useDropzone} from 'react-dropzone';
import request from 'superagent';
import axios from 'axios';

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
  
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} байт { xlsReady ? <a href="result.xls" className="btn btn-success custom-margin" role="button">Скачать</a> :  <button type="button" className="btn btn-secondary custom-margin" disabled>Скачать</button> }
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

  return (
    <section className="container">
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <p>Перетащите файл сюда или нажмите, чтобы выбрать файл</p>
      </div>
      <aside className="file-list">
        <h4>Выбрано</h4>
        <div className="checkbox-block">
			<div className="form-check custom-margin">
				<input className="form-check-input" 
					type="checkbox" 
					checked={removeDuplicates} 
					onChange={() => setRemoveDuplicates(!removeDuplicates)} 
					id="defaultCheck1"
				/>
			  <label className="form-check-label" htmlFor="defaultCheck1">
				Видалити дублюючі вакансії — від одного роботодавця на одну і ту ж саму посаду
			  </label>
			</div>
			<div className="form-check custom-margin">
			  	<input className="form-check-input" 
					type="checkbox" 
					checked={formatAddress} 
					onChange={() => setFormatAddress(!formatAddress)} 
					id="defaultCheck1"
				/>
			  <label className="form-check-label" htmlFor="defaultCheck1">
				Покращити формат фактичної адреси ПОУ — привести її до виду: Місто, вулиця, № будинка. Видалити номер квартири/офісу, якщо присутній
			  </label>
			</div>
		</div>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}

export default Basic;
