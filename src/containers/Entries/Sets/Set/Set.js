import React from 'react';
import classes from './Set.module.css';
import moment from 'moment';
import { Popover } from 'antd';
import { QuestionCircleOutlined } from "@ant-design/icons";
const set = props => {
    const content = (
        <div className={classes.Pop_Container}>
            <p><strong>Rest:</strong> {moment.utc(props.rest * 1000).format('mm:ss')}</p>
            { props.notes !== "" ? <p><strong>Notes:</strong> <span style={{ color: '#a0a0a0' }}>{props.notes}</span></p> : null}
            <p style={{ color: 'white', width: 'max-content', marginLeft: 'auto', backgroundColor: 'black', padding: '0 5px 0', borderRadius: '2px' }}>{moment(props.date).format('h:mm a')}</p>
            <p className={classes.Pop_Delete} onClick={() => props.clicked(props.entryKey, props.setKey)} >Delete</p>
        </div>
    )

    return (
        <div className={classes.Set_Container}>
            <div className={classes.Set_Block}>SET {props.index + 1}</div>
            <div className={classes.Set_Desc}>
                <div style={{ width: '60px', textAlign: 'center' }}>{props.weight}</div>
                <div style={{ width: '30px', textAlign: 'center', color: '#a0a0a0' }}>x</div>
                <div style={{ width: '30px', textAlign: 'center' }}>{props.reps}</div>
            </div>
            <Popover trigger="click" content={content} placement="bottom">
                <QuestionCircleOutlined className={classes.Q_Button} />
            </Popover>
        </div>
    )

}






export default set;

