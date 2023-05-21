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
            <div key={`header-${item}`} style={{ width: '14%', cursor: 'pointer', padding: '2px' }}
                onClick={event => onClickHandler(event, [item])}
                onContextMenu={event => onClickHandler(event, [item]) } >
                { value }
            </div>
        );
    });

    const weekdays = days.reduce((resultArray, item, index) => { 
        const chunkIndex = Math.floor(index / 7)
      
        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = []
        }
      
        resultArray[chunkIndex].push(item)
      
        return resultArray
    }, []);

    const weeks = weekdays.map((days, weekIndex) => 
    <div key={`row-${weekIndex}`} style={{ height: '12%', display: 'flex', justifyContent: 'space-between' }}>
        { days }
    </div>
);

    const onHeaderClick = (event, weekDay) => {
        onClickHandler(event, calendarDays.filter(day => day.getMonth() === date.getMonth() && day.getDay() === weekDay));
    };

    const header = 
        <div style={{display: 'flex', justifyContent: 'space-between', height: '12%' }}>
            { daysOfWeek.map((item, idx) => 
                <div style={{ width: '14%', cursor: 'pointer', padding: '2px' }}>
                    <div key={`header-${item}`} style={{ height: '100%', width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', border: 'solid #d3d4d5 1px', borderRadius: '4px' }}
                        onClick={event => onHeaderClick(event, (idx + 1) % 7)}
                        onContextMenu={event => onHeaderClick(event, (idx + 1) % 7)} >
                        { item }
                    </div>
                </div>
                ) }
        </div>;

    const onMonthClick = (event) => {
        onClickHandler(event, calendarDays.filter(day => day.getMonth() === date.getMonth()));
    }

    const fullSize = { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', margin: '0px 10px' };
    const monthStyle = { display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', textAlign: 'center', border: 'solid #d3d4d5 1px', borderRadius: '4px' };
    return (
        <div style={fullSize}>
            <div style={{ height: '12%', padding: '2px' }}>
                <div onClick={event => onMonthClick(event)} onContextMenu={event => onMonthClick(event)} style={monthStyle}>
                    <div style={{ display: 'contents', width: 'fit-content' }}>{ format(date, 'MMMM') }</div>
                </div>
            </div>
            { header }
            { weeks }
        </div>
    );
}