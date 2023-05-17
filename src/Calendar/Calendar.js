import React, { useEffect, useState, useRef } from 'react';

import './Calendar.css';

import Month from './Month';

import { useHasChanged } from '../Utils/ReactUtils';
import { add, sub } from 'date-fns';

import { AiOutlineRight, AiOutlineLeft } from 'react-icons/ai';

import { Button } from "@chakra-ui/react";

const emptySelectionSet = new Set();

function Calendar({ date, lookAhead, onSelection, onSetDate, renderDay, isActive }) {
    const currentSelection = useRef(emptySelectionSet);
    // const isCollecting = useRef(false);

    const [selection, setSelection] = useState([]);
    const isSelectionChanged = useHasChanged(selection);

    useEffect(() => {
        currentSelection.current.clear();
        setSelection([]);
    }, [date]);

    useEffect(() => {
        if (isSelectionChanged && selection.length) {
            // onSelection(getEventsForSelection(events, selection.map(index => calendarDays[index])), ViewMode.Calendar);
        }
    });

    const months = Array.from(new Array(lookAhead))
        .map((_, ahead) => add(date, { months: ahead }))
        .map((date, idx) => <Month key={`month-${idx}`} date={date} renderDay={renderDay} onClick={(selection, mode) => onSelection(selection, mode)} />);    

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
