import React, { Fragment } from 'react';

function StateRadioButtonGroup({ type, isActive, id, option1, option2, onChange }) {  
    return <div className="row">
        <div className="col-md-4 d-flex align-items-center">
            <label><b>{type}</b></label>
        </div>

        <div className="col-md-8">
            <div onChange={onChange} >
                <div className="form-check">
                    <input className="form-check-input" type="radio" name={id} id={id + 1} value="true" checked={isActive} />
                    <label className="form-check-label" htmlFor={id + 1}>
                        {option1}
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="radio" name={id} id={id + 2} value="false" checked={!isActive} />
                    <label className="form-check-label" htmlFor={id + 2}>
                        {option2}
                    </label>
                </div>
            </div>
        </div> 
           
    </div>;
}

export default StateRadioButtonGroup;