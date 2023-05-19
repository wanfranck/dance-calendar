import { getCalendarDays } from '../Utils/TimeUtils';
import { format } from 'date-fns';

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Month({ date, onClick, renderDay }) {
    const calendarDays = getCalendarDays(date);

    const onClickHandler = (event, items) => { 
        onClick(event, items);

        if (event.ctrlKey) {
            event.preventDefault(); 
        }
    }

    const days = calendarDays.map(item => {
        const isCurrentMonth = item.getMonth() === date.getMonth();
        const value = isCurrentMonth ? renderDay(item) : '';

        return (
            <td key={`header-${item}`} style={{ width: '14%' }}
                onClick={event => onClickHandler(event, [item])}
                onContextMenu={event => onClickHandler(event, [item]) } >
                { value }
            </td>
        );
    });

    const daysNew = calendarDays.map(item => {
        const isCurrentMonth = item.getMonth() === date.getMonth();
        const value = isCurrentMonth ? renderDay(item) : '';

        return (
            <div key={`header-${item}`} style={{ width: '14%' }}
                onClick={event => onClickHandler(event, [item])}
                onContextMenu={event => onClickHandler(event, [item]) } >
                { value }
            </div>
        );
    });

    console.log(1 + days.length / 7);

    const weekDays = days.reduce((resultArray, item, index) => { 
        const chunkIndex = Math.floor(index / 7)
      
        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = []
        }
      
        resultArray[chunkIndex].push(item)
      
        return resultArray
    }, []);

    const weekDaysNew = daysNew.reduce((resultArray, item, index) => { 
        const chunkIndex = Math.floor(index / 7)
      
        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = []
        }
      
        resultArray[chunkIndex].push(item)
      
        return resultArray
    }, []);

    const weeks = weekDays.map((days, weekIndex) => 
        <tr key={`row-${weekIndex}`} style={{ height: '12%' }}>
            { days }
        </tr>
    );

    const weeksNew = weekDaysNew.map((days, weekIndex) => 
    <div key={`row-${weekIndex}`} style={{ height: '12%', display: 'flex', justifyContent: 'space-between' }}>
        { days }
    </div>
);

    const onHeaderClick = (event, weekDay) => {
        onClickHandler(event, calendarDays.filter(day => day.getMonth() === date.getMonth() && day.getDay() === weekDay));
    };

    const headers = 
        <tr>
            { daysOfWeek.map((item, idx) => 
                <td key={`header-${item}`} style={{ width: '14%' }}
                    onClick={event => onHeaderClick(event, (idx + 1) % 7)}
                    onContextMenu={event => onHeaderClick(event, (idx + 1) % 7)} >
                    { item }
                </td>) }
        </tr>;

    const headersNew = 
        <div style={{display: 'flex', justifyContent: 'space-between', height: '12%' }}>
            { daysOfWeek.map((item, idx) => 
                <div key={`header-${item}`} style={{ width: '14%', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                    onClick={event => onHeaderClick(event, (idx + 1) % 7)}
                    onContextMenu={event => onHeaderClick(event, (idx + 1) % 7)} >
                    { item }
                </div>) }
        </div>;

    const onMonthClick = (event) => {
        onClickHandler(event, calendarDays.filter(day => day.getMonth() === date.getMonth()));
    }

    const fullSize = { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid black', borderRadius: '5px' };
    const height90Size = { width: '100%', height: '90%' };
    return (
        <div style={fullSize}>
            <div onClick={event => onMonthClick(event)} onContextMenu={event => onMonthClick(event)} style={{ textAlign:'center' }}>{ format(date, 'MMMM') }</div>
            { headersNew }
            { weeksNew }
            {/* <table style={height90Size}>
                <thead style={{ height: '12%' }}>
                    { headers }
                </thead>
                <tbody style={{ height: '84%' }}>
                    { weeks }
                </tbody>
            </table> */}
        </div>
    );
}