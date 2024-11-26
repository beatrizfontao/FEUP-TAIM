import React from 'react';
import { Popover } from 'react-bootstrap';
import './../styles/Filter.css'

const Tooltip = ({ title, value }) => {
    return (<div>
            <Popover id="popover-basic" className='fixed-popover'>
                <Popover.Header as="h1" style={{fontSize: '1.1em'}}>{title}</Popover.Header>
                <Popover.Body>
                    Value: {value} $
                </Popover.Body>
            </Popover>

    </div>);
}

export default Tooltip;
