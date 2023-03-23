import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

import './App.css';

import Calendar from './Calendar';
import List from './List';
import Popup from './Popup';
import SelectionConfirmation from './SelectionConfirmation';
import Map from './Map';

import ViewController, { ViewMode } from './ViewController';
import DateController from './DateController';

import { isEventInDay, getEventsAfter } from './Utils/EventUtils';
import getEvents from './Events/Events';

import { AiTwotoneFilter } from 'react-icons/ai';
import { Tag, Button, Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton } from '@chakra-ui/react';

function PopupContent({ events }) {
  const style = { borderRadius: '4px', backgroundColor: 'white', margin: 'auto', width: '60%', height: '60%' };
  
  const [mode, setMode] = useState(ViewMode.List);
  
  return (
    <div style={style}>
        <div className="NavigationBar">
          <ViewController views={[ViewMode.List, ViewMode.Map]} setViewMode={(mode) => setMode(mode)} />
        </div>
        <div className='Container'>
          <List events={events} isActive={mode === ViewMode.List} />
          <Map events={events} isActive={mode === ViewMode.Map} />
        </div>
    </div>
  );
}

function App() {
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [popupItems, setPopupItems] = useState([]);
  const [showSelection, setShowSelection] = useState(false);
  const [popupPosition, setPopupPosition] = useState(null);
  const [mode, setMode] = useState(ViewMode.Calendar);

  useEffect(() => {
    async function loadEvents() {
      console.log("Getting events...");
      const events = await getEvents();
      console.log("Finished.");
      console.log("Events: ", events);
      setEvents(events);
    }

    loadEvents();
  }, []);

  function onSelection(items) {
    setPopupItems(items);
  }

  function closePopup() {
    setPopupItems([]);
  }

  function onStopSelection(event) {
    setPopupPosition([event.pageX, event.pageY]);
  }

  function onClose() {
    setPopupPosition(null);
  }

  function onConfirm() {
      setShowSelection(true);
      setPopupPosition(null);
  }

  function renderDay(dayDate, index) {
    const dayEvents = events.filter(event => isEventInDay(event, dayDate));
    const tags = Array.from(dayEvents
      .map(e => e.tags)
      .flat()
      .reduce((tags, tag) => {
        tags.add(tag);
        return tags;
    }, new Set()));

    return (
      <div style={{ display: 'block', width: '100%', height: '100%' }} key={`day-cell-content-${index}`}>
        <p>{ format(dayDate, "MMM do") }</p>
        { dayEvents.length ? <p>{ "events: " + dayEvents.length }</p> : <p /> }
        <div style={{ display: 'inline-block', height: '50%', overflow: 'scroll' }}>
          { tags.map((t, idx) => (<Tag colorScheme='blackAlpha' variant='outline' size='sm' margin={'3px'} key={`tag-${idx}`} float='left'>{ t }</Tag>)) }
        </div>
      </div>
    );
  }

  function renderHeader(item, index) {
      return (
        <div style={{color: 'navy'}} key={`header-cell-content-${index}`}>
          {item}
        </div>
      );
  }

  return (
    <div className="App">

      <div className="NavigationBar">
        <DateController onSetDate={(date) => setDate(date)} />
        <ViewController views={[ViewMode.Calendar, ViewMode.List, ViewMode.Map]} setViewMode={(mode) => setMode(mode)} />
        <Popover>
          <PopoverTrigger>
            <Button colorScheme='blue' style={{ height: '90%' }}>
              <AiTwotoneFilter width='100%' height='100%' />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Confirmation!</PopoverHeader>
            <PopoverBody>Are you sure you want to have that milkshake?</PopoverBody>
          </PopoverContent>
        </Popover>
      </div>
        

      <Popup content={popupItems ? <PopupContent events={popupItems} /> : null} isShow={showSelection} onClose={() => setShowSelection(false)} />
      <SelectionConfirmation position={popupPosition} selection={popupItems} onConfirm={onConfirm} onClose={onClose} />
      <div className='Container'>
        <Calendar events={events} date={date} 
                  onStopSelection={onStopSelection} onStartSelection={closePopup}
                  onSelection={onSelection}
                  renderHeader={renderHeader} renderCell={renderDay}
                  isActive={mode === ViewMode.Calendar} />
        <List events={events} isActive={mode === ViewMode.List} />
        <Map events={events} onEventClick={onStopSelection}isActive={mode === ViewMode.Map} />
      </div>

    </div>
  );
}

export default App;
