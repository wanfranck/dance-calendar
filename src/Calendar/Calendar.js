import React from 'react';

import './Calendar.css';

import Month from './Month';

import { add, sub } from 'date-fns';

import { AiOutlineRight, AiOutlineLeft } from 'react-icons/ai';

import { Button } from "@chakra-ui/react";

function Calendar({ date, lookAhead, onSelection, onSetDate, renderDay, isActive }) {
    const months = Array.from(new Array(lookAhead))
        .map((_, ahead) => add(date, { months: ahead }))
        .map((date, idx) => <Month key={`month-${idx}`} date={date} renderDay={renderDay} onClick={(event, selection, mode) => onSelection(event, selection, mode)} />);    

    const buttonStyle = { display: 'flex', flexDirection: 'column', justifyContent: 'center' };

    return (
        <div className={`Calendar ${isActive ? '' : 'Hidden'}`} >
            <div style={buttonStyle}>
                <Button height='40%' colorScheme='blue' onClick={() => onSetDate(sub(date, { months: 1 }))}><AiOutlineLeft width='100%' height='100%' /></Button>
            </div>        
            {months}
            <div style={buttonStyle}>
                <Button height='40%' colorScheme='blue' onClick={() => onSetDate(add(date, { months: 1 }))}><AiOutlineRight width='100%' height='100%' /></Button>
            </div>
        </div>
    );
}

export default Calendar;
