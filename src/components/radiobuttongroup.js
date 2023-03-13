import React, { Fragment } from 'react';
import "./radiobuttongroup.css"

function StateRadioButtonGroup({ type, isActive, id, validated, option1, option2, onChange }) {
    return <div className="row">

        {type &&
            <div className="col-md-5 d-flex align-items-center">
                <div className="box"><b>{type}</b></div>
            </div>
        }

        <div className="col-md-7">
            {onChange ? <div className={(validated && (isActive === undefined || isActive === '') ? "not-valid-border" : "")}>
                <div className="form-check">
                    <input className="form-check-input" type="radio" name={id} id={id + 1} value="true" checked={isActive === true} onChange={onChange} />
                    <label className="form-check-label" htmlFor={id + 1}>
                        {option1}
                    </label>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="radio" name={id} id={id + 2} value="false" checked={isActive === false} onChange={onChange} />
                    <label className="form-check-label" htmlFor={id + 2}>
                        {option2}
                    </label>
                </div>
            </div> :
                <div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name={id} id={id + 1} checked={isActive === true} disabled />
                        <label className="form-check-label" htmlFor={id + 1}>
                            {option1}
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="radio" name={id} id={id + 2} checked={isActive === false} disabled />
                        <label className="form-check-label" htmlFor={id + 2}>
                            {option2}
                        </label>
                    </div>
                </div>}

        </div>            
    </div>;
}

export default StateRadioButtonGroup;