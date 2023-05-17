import { useEffect } from "react";
import { add, sub } from 'date-fns';

import { useHasChanged } from "../Utils/ReactUtils";

import './DateController.css';

function DateController({ date, onSetDate }) {
    const isDateChanged = useHasChanged(date);

    useEffect(() => {
        if (isDateChanged) {
            onSetDate(date);
        }
    });

    function onPrev() {
        ;
    }
    
    function onNext() {
        onSetDate(add(date, { months: 1 }));
    }

    return (
        <div className='Horizontal DateController'>
            <div className='CurrentMonth'>{date.toLocaleString('default', { month: 'long' }).toUpperCase()}</div>
        </div>
    );
}

export default DateController;