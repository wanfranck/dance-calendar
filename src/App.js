import React, { useEffect, useState } from 'react';
import { format, parse } from 'date-fns';

import './App.css';

import Calendar from './Calendar';
import List from './List';
import Map from './Map';
import FilterControl from './FilterControl';

import { ViewMode } from './ViewController';

import { isEventInDay } from './Utils/EventUtils';
import getEvents from './Events/Events';

import { AiOutlineClear } from 'react-icons/ai';
import { Button } from '@chakra-ui/react';

import { isCurrentDay } from './Utils/TimeUtils';

import { AiOutlineCalendar } from 'react-icons/ai';
import { MdLocationOn } from 'react-icons/md';

// import DateController from './DateController';
// import SelectionConfirmation from './SelectionConfirmation';

// function PopupContent({ events, onItemClick, onClose }) {
//   const style = { borderRadius: '4px', backgroundColor: 'white', margin: 'auto', width: '60%', height: '60%' };
  
//   return (
//     <div style={style}>
//         <div className="NavigationBar" style={{justifyContent: 'end'}}>
//           <Button colorScheme='blue' style={{ float:'right', height: '90%' }} onClick={onClose}>
//             <AiOutlineClose width='100%' height='100%' />
//           </Button>
//         </div>
//         <div className='Container'>
//           <List prefix={'secondary'} onItemClick={onItemClick} events={events} isActive={true} />;
//         </div>
//     </div>
//   );
// }

function App() {
  const [allEvents, setAllEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentDate, setDate] = useState(new Date());
  const [popupItems, setPopupItems] = useState([]);
  const [selection, setDaysSelection] = useState([]);
  const [mode, setMode] = useState(ViewMode.Calendar);
  const [tagsFilter, setTagsFilter] = useState([]);
  const [chosenTags, setChosenTags] = useState([]);

  // const [showSelection, setShowSelection] = useState(false);
  // const [popupPosition, setPopupPosition] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      console.log("Getting events...");
      const events = await getEvents();
      console.log("Finished.");
      console.log("Events: ", events);
      setAllEvents(events);
      setEvents(events);
      const allTags = events.reduce((acc, ev) => new Set([...new Set(ev.tags), ...acc]), new Set());
      setTagsFilter([...allTags]);
      setChosenTags([]);
    }

    loadEvents();
  }, []);

  function onSelection(items, source) {
    if (source === ViewMode.Calendar) {
      setDaysSelection(items);
      setPopupItems(events.filter(event => items.some(day => isEventInDay(event, day))));
    } else if (source === ViewMode.Map) {
      setDaysSelection(items.map(item => parse(item.date, "dd-MM-yyyy", new Date())));
      setPopupItems(items);
    }
  }

  // function onClose() {
  //   setPopupPosition(null);
  // }

  // function onConfirm() {
  //     setShowSelection(true);
  //     setPopupPosition(null);
  // }

  function onSetTagFilter(tag) {
    const newChosenTags = [...new Set(
      [...chosenTags.filter(t => [tag].indexOf(t) === -1), 
       ...[tag].filter(t => chosenTags.indexOf(t) === -1)]
    )];
    setChosenTags(newChosenTags);
    setEvents(newChosenTags.length ? allEvents.filter(event => event.tags.some(tag => newChosenTags.indexOf(tag) !== -1)) : allEvents);
  }

  function renderDay(date) {
    const dayEvents = events.filter(ev => isEventInDay(ev, date));
    const isSelected = selection.filter(selectedDate => selectedDate.getTime() === date.getTime()).length;
    const cellColor = isSelected ? 'green' : (dayEvents.length ? 'blue' : 'white');
    const dayStyle = { backgroundColor: cellColor, border: isCurrentDay(date) ? '2px solid red' : '' };
    
    return (
      <div style={dayStyle}>
        { format(date, "d") }
      </div>
    );
  }

  return (
    <div className="App">
      <div className="NavigationBar" style={{ justifyContent:'space-between' }}>
        <div style={{display:'flex'}}>
          {/* <DateController date={currentDate} /> */}
          {/* <ViewController mode={mode} views={[ViewMode.Calendar, ViewMode.Map]} setViewMode={(mode) => { setMode(mode); }} /> */}
          <Button key="view-calendar" height='90%' colorScheme='blue' onClick={() => setMode(ViewMode.Calendar)}>
            <AiOutlineCalendar width='100%' height='100%' />
          </Button>
          <Button key="view-map" height='90%' colorScheme='blue' onClick={() => setMode(ViewMode.Map)}>
            <MdLocationOn width='100%' height='100%' />
          </Button>
          <FilterControl date={currentDate} 
                         tags={
                          tagsFilter.map((tag) => 
                            ({ value: tag, isActive: chosenTags.indexOf(tag) !== -1}))
                         } 
                         onChangeDate={d => setDate(d)} 
                         onChangeFilter={tag => onSetTagFilter(tag)} />
        </div>
        
        <Button colorScheme='blue' style={{ height: '90%' }}>
          <AiOutlineClear width='100%' height='100%' />
        </Button>
      </div>

      {/* <SelectionConfirmation position={popupPosition} selection={popupItems} onConfirm={onConfirm} onClose={onClose} /> */}
      
      <div className='Container'>
        <Calendar prefix={'main'} events={events} 
            onSelection={onSelection} onSetDate={(date) => setDate(date)}
            renderDay={renderDay} 
            date={currentDate} lookAhead={3} 
            isActive={mode === ViewMode.Calendar} />
        <Map prefix={"main"} events={events} selectedEvents={popupItems}
            onSelection={onSelection} 
            isActive={mode === ViewMode.Map} />
      </div>
      <List prefix={"main"} onItemClick={item => window.open(item.link)} events={popupItems} isActive={popupItems.length} />

      { /* <Popup content={popupItems ? 
                <PopupContent onClose={() => setShowSelection(false)} 
                              onItemClick={(item) => { console.log(item); window.open(item.link); }}
                              events={popupItems} /> : null} 
             isShow={showSelection} 
             onClose={() => setShowSelection(false)} /> */ } 
    </div>
  );
}

export default App;
