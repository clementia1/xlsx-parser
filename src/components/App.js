import React from 'react';
import Basic from './Dropzone.js';

class App extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <div className="container-fluid">
					<Basic />
                </div>
            </div>
        );
    }
}

export default App;
