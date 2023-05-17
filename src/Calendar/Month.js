import { getCalendarDays } from '../Utils/TimeUtils';
import { ViewMode } from '../ViewController';
import { format } from 'date-fns';

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Month({ date, onClick, renderDay }) {
    const calendarDays = getCalendarDays(date);

    const days = calendarDays.map(item => {
        const isCurrentMonth = item.getMonth() === date.getMonth();
        const value = isCurrentMonth ? renderDay(item) : '';

        return (
            <td key={`header-${item}`} onClick={_ => onClick([item], ViewMode.Calendar)}>
                { value }
            </td>
        );
    });

    const weekDays = days.reduce((resultArray, item, index) => { 
        const chunkIndex = Math.floor(index / 7)
      
        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = []
        }
      
        resultArray[chunkIndex].push(item)
      
        return resultArray
    }, []);;

    const weeks = weekDays.map((days, weekIndex) => 
        <tr key={`row-${weekIndex}`}>
            { days }
        </tr>
    );

    const onHeaderClick = (weekDay) => {
        onClick(calendarDays.filter(day => day.getMonth() === date.getMonth() && day.getDay() === weekDay), ViewMode.Calendar);
    };

    const headers = 
        <tr>
            { daysOfWeek.map((item, idx) => 
                <td key={`header-${item}`} onClick={_ => onHeaderClick((idx + 1) % 7)}>
                    { item }
                </td>) }
        </tr>;

    const onMonthClick = () => {
        onClick(calendarDays.filter(day => day.getMonth() === date.getMonth()), ViewMode.Calendar);
    }

    const fullSize = { width: '100%', height: '100%', border: '1px solid black', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' };
    const height90Size = { width: '100%', height: '90%', border: '1px solid black' };
    return (
        <div style={fullSize}>
            <div onClick={_ => onMonthClick()} style={{ textAlign:'center' }}>{ format(date, 'MMMM') }</div>
            <table style={height90Size}>
                <thead>
                    { headers }
                </thead>
                <tbody>
                    { weeks }
                </tbody>
            </table>
        </div>
    );
}