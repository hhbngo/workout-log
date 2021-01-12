import React from 'react';
import classes from './Form.module.css';

const createFormElements = (props, elConfig, name) => {
    switch (elConfig.ElementType) {
        case 'input':
            return <input
                key={name}
                className={classes.Input}
                type={elConfig.config.type}
                placeholder={elConfig.config.placeholder}
                onChange={(event) => props.inputChanged(event, name)}
                value={elConfig.value} />;
        case 'select': <p>Select placeholder</p> ///place holder currently
            break;
        default: return null
    }
}

const form = (props) => {
    let error = null
    let error2 = null
    let disabledBtn = false
    if (props.config.error) error = <p style={{ color: '#ff7875', fontSize: '18px' }}>{props.config.error}!</p>;
    if (props.config.error2) error2 = <p style={{ color: '#ff7875', fontSize: '18px' }}>{props.config.error2}!</p>;
    if (props.loading || props.config.error2) disabledBtn = true

    return (
        <div className={classes.Container}>
            <h1>{props.config.formTitle}</h1>
            {error}
            <form className={classes.FormContainer}>
                {Object.keys(props.fields).map(el => createFormElements(props, props.fields[el], el))}
                {error2}
                <input className={classes.Button} onClick={props.buttonClicked} disabled={disabledBtn} type="submit" value={props.config.btnText ? props.config.btnText : 'Submit'} />
            </form>
            <p className={classes.Option} onClick={props.optionClicked}>{props.config.optionText} </p>
        </div>
    )
}

export default form;