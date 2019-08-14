import React from 'react';
import Basic from './Dropzone.js';
import FilterProperties from './FilterProperties.js';

class App extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <div className="container-fluid">					
					<Basic />
					<FilterProperties />
                </div>
            </div>
        );
    }
}

export default App;
