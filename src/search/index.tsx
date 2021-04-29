import React from 'react';
import ReactDom from 'react-dom';
import './search.scss';
import FR from './first';
import helloworld from '../baby/index';
import h from '../baby/hahah.js';

console.log(h);

const noUse = "i am noUsed code4440000";
if(noUse) {
    console.log(noUse);
}

const ComponentApp: React.FC = props => {
    return <div className="wrapper-box">
        footer{helloworld}
        <FR name="constantince" index={2} />
    </div>
}

ReactDom.render(<ComponentApp />, document.getElementById('root'));


