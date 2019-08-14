import React from 'react';
import filter from './Images/Filter.png'; 
import columns from './Images/Columns.png'; 

function FilterProperties() {
  return (
	<div className="image-block">
		<img className="eias-image" src={filter} alt="Filter" />
		<img className="eias-image" src={columns} alt="Columns" />
	</div>
	)
}

export default FilterProperties;
