import { useEffect } from "react";
import { add, sub } from 'date-fns';

import { useHasChanged } from "../Utils/ReactUtils";

import { AiOutlineRight, AiOutlineLeft } from 'react-icons/ai';

import { Button } from "@chakra-ui/react";

import './DateController.css';

function DateController({ date, onSetDate }) {
    const isDateChanged = useHasChanged(date);

    useEffect(() => {
        if (isDateChanged) {
            onSetDate(date);
        }
    });

    function onPrev() {
        onSetDate(sub(date, { months: 1 }));
    }
    
    function onNext() {
        onSetDate(add(date, { months: 1 }));
    }

    return (
        <div className='Horizontal DateController'>
            <Button height='90%' colorScheme='blue' onClick={onPrev}><AiOutlineLeft width='100%' height='100%' /></Button>
            <div className='CurrentMonth'>{date.toLocaleString('default', { month: 'long' }).toUpperCase()}</div>
            <Button height='90%' colorScheme='blue' onClick={onNext}><AiOutlineRight width='100%' height='100%' /></Button>
        </div>
    );
}

export default DateController;