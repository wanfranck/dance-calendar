import React, { useEffect, useState, useRef } from 'react';

import './Calendar.css';

import { useHasChanged } from '../Utils/ReactUtils';
import { isCurrentDay, getCalendarDays } from '../Utils/TimeUtils';
import { getEventsForSelection } from '../Utils/EventUtils';

import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
  } from '@chakra-ui/react'

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const emptySelectionSet = new Set();

function Calendar({ date, events, renderCell, renderHeader, onSelection, onStopSelection, onStartSelection, isActive }) {
    const currentSelection = useRef(emptySelectionSet);
    const isCollecting = useRef(false);

    const [selection, setSelection] = useState([]);
    const isSelectionChanged = useHasChanged(selection);

    useEffect(() => {
        currentSelection.current.clear();
        setSelection([]);
    }, [date]);

    useEffect(() => {
        if (isSelectionChanged && selection.length) {
            onSelection(getEventsForSelection(events, selection.map(index => calendarDays[index])));
        }
    });

    function onStartCollecting(event) {
        onStartSelection(event);
        isCollecting.current = true;
    }

    function onStopCollecting(event) {
        isCollecting.current = false;
        onStopSelection(event);
    }

    function onMouseAction(event, index) {
        if (isCollecting.current) {
            if (!event.metaKey && !event.ctrlKey) {
                currentSelection.current.clear();    
            }
    
            currentSelection.current.add(index);
            setSelection(Array.from(currentSelection.current));
        }
        
        event.preventDefault();
    }

    
    const calendarDays = getCalendarDays(date);
    const cells = calendarDays.map((day, dayIndex) => renderDayCell(day, dayIndex));
    const weeksCells = cells.reduce((resultArray, item, index) => { 
        const chunkIndex = Math.floor(index / 7)
      
        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = []
        }
      
        resultArray[chunkIndex].push(item)
      
        return resultArray
    }, []);;

    const rows = weeksCells.map((cells, weekIndex) => {
        return (
            <Tr width='100%'  key={`row-${weekIndex}`}>
                { cells }
            </Tr>
        );
    });

    function renderDayCell(dayDate, index) {
        const currentDayClass = isCurrentDay(dayDate) ? "Current": "";
        const notThisMonthClass = dayDate.getMonth() !== date.getMonth() ? "Disabled" : "";
        const inSelection = selection.indexOf(index) !== -1 ? "Selected" : "";
        const dayClass = `Item Cell ${notThisMonthClass} ${inSelection} ${currentDayClass}`;

        return (
            <Td className={dayClass}
                key={`cell-${index}`} 
                onContextMenu={(event) => onMouseAction(event, index)}
                onMouseMove={(event) => onMouseAction(event, index)}
                onMouseUp={(event) => onMouseAction(event, index)}>
                    {renderCell(dayDate, index)}
            </Td>
        );
      }

    function onHeaderClick(col, event) {
        if (!event.metaKey && !event.ctrlKey) {
            currentSelection.current.clear();    
        }
        const updates = new Set(calendarDays.map((day, index) => index).filter((index) => index % 7 === col));
        currentSelection.current = new Set([...updates, ...currentSelection.current]);
        setSelection(Array.from(currentSelection.current));
    }

    function renderHeaderCell(item, index) {
        return (
            <Th key={`header-${item}`} className="Item Cell Header" width='10%' onClick={(e) => onHeaderClick(index, e)}>
                {renderHeader(item, index)}
            </Th>
        );
    }
    
    return ( 
        <TableContainer overflowY={'scroll'} className={`Calendar ${isActive ? '' : 'Hidden'}`}>
            <Table variant='simple'
                   width='100%'
                   height='100%'
                   onContextMenu={(event) => onStartCollecting(event)}
                   onMouseDown={(event) => onStartCollecting(event)}
                   onMouseUp={(event) => onStopCollecting(event)} >
                <Thead width='100%'>
                    <Tr width ='100%' >
                        {daysOfWeek.map((item, index) => renderHeaderCell(item, index))}
                    </Tr>
                </Thead>
                <Tbody width='100%'>
                    {rows}
                </Tbody>
            </Table>
        </TableContainer>
    );
}

export default Calendar;
