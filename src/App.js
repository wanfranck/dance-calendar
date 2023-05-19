import React, { useCallback, useEffect, useState } from 'react';
import { add, format, parse } from 'date-fns';

import './App.css';

import Calendar from './Calendar';
import List from './List';
import Map from './Map';
import FilterControl from './FilterControl';

import { AiOutlineClear } from 'react-icons/ai';
import { Button } from '@chakra-ui/react';

import { isEventInDay } from './Utils/EventUtils';
import { isCurrentDay, getFirstDayOfMonth } from './Utils/TimeUtils';
import { useWindowSize } from './Utils/ReactUtils';

const App = ({ events }) => {
  const size = useWindowSize();
  const [currentDate, setDate] = useState(new Date());

  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);

  const [selection, setDaysSelection] = useState([]);
  const [tagsFilter, setTagsFilter] = useState([]);
  const [chosenTags, setChosenTags] = useState([]);

  const getTimeRangedEvents = (events, currentDate) => {
    const lastMonth = add(currentDate, {months: 3});
    const timeRange = [
      getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()), 
      getFirstDayOfMonth(lastMonth.getFullYear(), lastMonth.getMonth())
    ];
    
    return events.filter(event => {
      const date = parse(event.date, "dd-MM-yyyy", new Date());
      return date >= timeRange[0] && date < timeRange[1];
    });
  };

  useEffect(() => {
    setFilteredEvents(getTimeRangedEvents(events, currentDate));

    const allTags = events.reduce((acc, ev) => new Set([...new Set(ev.tags), ...acc]), new Set());
    setTagsFilter([...allTags]);
  }, [events, currentDate]);

  const onCalendarSelection = (e, dates) => {
    const isAdd = e.ctrlKey || e.metaKey;

    const newSelection = isAdd ? selection.concat(dates) : dates;
    const newItems = events.filter(event => newSelection.some(day => isEventInDay(event, day)));

    setDaysSelection(newSelection);
    setSelectedEvents(newItems);
  }

  const onMapSelection = useCallback((event) => {
    const { originalEvent, features } = event;
    const isAdd = originalEvent.ctrlKey || originalEvent.metaKey;

    const newEvents = features.map(({ properties }) => ({ 
        ...properties,
        tags: eval(properties.tags), 
        coordinates: eval(properties.coordinates)
    }));

    const newSelection = isAdd ? [...selectedEvents, ...newEvents] : newEvents;
    const newItems = newSelection.reduce((acc, event) => {
      const eventDate = parse(event.date, "dd-MM-yyyy", new Date());
      const alreadyHas = acc.some(date => date.getTime() === eventDate.getTime());
      return alreadyHas ? acc : [...acc, eventDate];
    }, []);

    setDaysSelection(newItems);
    setSelectedEvents(newSelection);
  }, [selectedEvents]);

  const onClearSelection = (_) => {
    setChosenTags([]);
    setDaysSelection([]);
    setSelectedEvents([]);
    setFilteredEvents(getTimeRangedEvents(events, currentDate));
  }

  const onSetTagFilter = (tag) => {
    const newChosenTags = [...new Set(
      [...chosenTags.filter(t => [tag].indexOf(t) === -1), 
       ...[tag].filter(t => chosenTags.indexOf(t) === -1)]
    )];
    const timeRangedEvents = getTimeRangedEvents(events, currentDate);

    setChosenTags(newChosenTags);
    setFilteredEvents(newChosenTags.length ? timeRangedEvents.filter(event => newChosenTags.every(tag => event.tags.indexOf(tag) !== -1)) : timeRangedEvents);
  }

  const renderDay = (date) => {
    const dayEvents = filteredEvents.filter(ev => isEventInDay(ev, date));
    const isSelected = selection.filter(selectedDate => selectedDate.getTime() === date.getTime()).length;
    const cellColor = isSelected ? 'green' : (dayEvents.length ? 'blue' : 'white');
    const dayStyle = { 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      textAlign:'center',
      width: '95%', 
      height: '95%', 
      backgroundColor: cellColor, 
      border: isCurrentDay(date) ? '2px solid red' : '' 
    };
    
    return (
      <div style={dayStyle}>
        <p> { format(date, "d") } </p>
      </div>
    );
  }

  console.log(size);
  const countLookAhead = (size) => {
    if (size.width < 800) return 1;
    if (size.width < 1150) return 2;
    
    return 3;
  }
  const lookAhead = countLookAhead(size);

  return (
    <div className="App">
      <div className="NavigationBar" style={{ justifyContent:'space-between' }}>
        <div style={{display:'flex'}}>
          <FilterControl date={currentDate} 
                         tags={
                          tagsFilter.map((tag) => 
                            ({ value: tag, isActive: chosenTags.indexOf(tag) !== -1}))
                         } 
                         onChangeDate={d => setDate(d)} 
                         onChangeFilter={tag => onSetTagFilter(tag)} />
        </div>
        
        <Button colorScheme='blue' style={{ height: '90%' }} 
            onClick={event => onClearSelection(event)}>
          <AiOutlineClear width='100%' height='100%' />
        </Button>
      </div>

      <div className='Container'>
        <Calendar prefix={'main'} 
            onSelection={onCalendarSelection}
            onSetDate={(date) => setDate(date)}
            renderDay={renderDay} 
            date={currentDate}
            lookAhead={lookAhead} 
            isActive={true} />

        <div style={{display: 'flex', flexDirection: size.width < 1150 ? 'column' : 'row', width: '100%', height: size.width < 1150 ? '100%' : '50%'}}>
          <div style={{ width: size.width < 1150 ? '100%' : '60%', height: size.width < 1150 ? '50%' : '100%' }}>
            <Map prefix={"main"} 
                currentEvents={filteredEvents} 
                selectedEvents={selectedEvents}
                onSelection={onMapSelection} 
                isActive={true}
                windowSize={size} />
          </div>
          <div style={{ width: size.width < 1150 ? '100%' : '40%', height: size.width < 1150 ? '50%' : '100%' }}>
            <List prefix={"main"} 
              events={selectedEvents.length ? selectedEvents : filteredEvents} 
              onItemClick={item => window.open(item.link)}
              isActive={true} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
