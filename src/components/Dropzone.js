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
  
  
  const files = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} байт { xlsReady ? <a href="result.xls" className="btn btn-success custom-margin" role="button">Скачать</a> :  <button type="button" className="btn btn-secondary custom-margin" disabled>Скачать</button> }
    </li>
  ));

function onDrop(acceptedFiles) {
   setReadyXls(false);
  const req = request.post('http://localhost:4000/upload')
  acceptedFiles.forEach(file => {
    req.attach('file', file)
    console.log(file)
  })
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
        <ul>{files}</ul>
      </aside>
    </section>
  );
}

export default Basic;
