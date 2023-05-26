import React from 'react';

import './Calendar.css';

import Month from './Month';

import { add, sub } from 'date-fns';

import { AiOutlineRight, AiOutlineLeft } from 'react-icons/ai';
import { Button } from 'react-bootstrap';

import { useState } from 'react';

import { BrowserView, MobileView } from 'react-device-detect';

const minSwipeDistance = 50;

function Calendar({
    date,
    lookAhead,
    onSelection,
    onSetDate,
    renderDay,
    renderHeader,
    renderTitle,
    isActive,
}) {
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isLeftSwipe || isRightSwipe) {
            onSetDate(
                isRightSwipe
                    ? sub(date, { months: 1 })
                    : add(date, { months: 1 })
            );
        }
    };

    const months = Array.from(new Array(lookAhead))
        .map((_, ahead) => add(date, { months: ahead }))
        .map((date, idx) => (
            <Month
                key={`month-${idx}`}
                date={date}
                renderDay={renderDay}
                renderHeader={renderHeader}
                renderTitle={renderTitle}
                onClick={(event, selection, mode) =>
                    onSelection(event, selection, mode)
                }
            />
        ));

    const buttonStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '96%',
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <BrowserView className={`Calendar ${isActive ? '' : 'Hidden'}`}>
                <Button
                    variant="light"
                    style={{ ...buttonStyle, margin: '2px 3px 2px 0' }}
                    onClick={() => onSetDate(sub(date, { months: 1 }))}
                >
                    <AiOutlineLeft width="100%" />
                </Button>
                {months}
                <Button
                    variant="light"
                    style={{ ...buttonStyle, margin: '2px 0 2px 3px' }}
                    onClick={() => onSetDate(add(date, { months: 1 }))}
                >
                    <AiOutlineRight width="100%" />
                </Button>
            </BrowserView>
            <MobileView
                className={`Calendar ${isActive ? '' : 'Hidden'}`}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {months}
            </MobileView>
        </div>
    );
}

export default Calendar;
