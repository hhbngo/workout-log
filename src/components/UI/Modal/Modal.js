import React from 'react';
import Backdrop from '../Backdrop/Backdrop';
import classes from './Modal.module.css'

const Modal = (props) => {
    const { Modal, active } = classes;

    return (
        <div>
            <Backdrop show={props.show} clicked={props.clicked} />
            <div className={props.show ? `${Modal} ${active}` : Modal}>
                {props.children}
            </div>
        </div>
    )
}

export default Modal;