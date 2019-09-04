import React from 'react';
import filter from './Images/Filter.png'; 
import columns from './Images/Columns.png'; 

function FilterProperties() {
  return (
	<section className="container small-padding">
		<div className="description">
			<h5>Необхідно дотримуватись параметрів фільтру</h5>
		</div>
		<div className="image-block">		
			<img className="eias-image" src={filter} alt="Filter" />
			<img className="eias-image" src={columns} alt="Columns" />
		</div>
	</section>
	)
}

export default FilterProperties;
