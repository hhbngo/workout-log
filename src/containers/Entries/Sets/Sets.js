import React from 'react';
import Set from './Set/Set';

const sets = (props) => {
    return (
        <div>
            {props.data.map((set, index) => <Set {...set} index={index} key={index + 1} clicked={props.clicked} setKey={set.key} entryKey={props.entryKey} />)}
        </div>
    )
}

export default sets;