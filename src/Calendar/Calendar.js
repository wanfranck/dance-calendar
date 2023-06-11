import { useState } from 'react';
import { add, sub } from 'date-fns';
import { AiOutlineRight, AiOutlineLeft } from 'react-icons/ai';
import { Button } from 'react-bootstrap';
import { BrowserView, MobileView } from 'react-device-detect';

import Month from './Month';

import './Calendar.css';
import { minSwipeDistance } from './constants';

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

    const buttonDivStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <BrowserView
                className={`Calendar ${isActive ? '' : 'Hidden'}`}
                style={{ gap: '20px' }}
            >
                <div style={{ ...buttonDivStyle }}>
                    <Button
                        variant="light"
                        style={{ height: '76%' }}
                        onClick={() => onSetDate(sub(date, { months: 1 }))}
                    >
                        <AiOutlineLeft width="100%" />
                    </Button>
                </div>
                {months}
                <div style={{ ...buttonDivStyle }}>
                    <Button
                        variant="light"
                        style={{ height: '76%' }}
                        onClick={() => onSetDate(add(date, { months: 1 }))}
                    >
                        <AiOutlineRight width="100%" />
                    </Button>
                </div>
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
