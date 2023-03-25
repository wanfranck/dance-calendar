import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

import './App.css';

import Calendar from './Calendar';
import List from './List';
import Popup from './Popup';
import SelectionConfirmation from './SelectionConfirmation';
import Map from './Map';
import Tag from './Tag';

import ViewController, { ViewMode } from './ViewController';
import DateController from './DateController';

import { isEventInDay } from './Utils/EventUtils';
import getEvents from './Events/Events';

import { AiTwotoneFilter, AiOutlineClose, AiOutlineClear } from 'react-icons/ai';
import { Button, Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton, Input,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb, } from '@chakra-ui/react';


function PopupContent({ events, onClose }) {
  const style = { borderRadius: '4px', backgroundColor: 'white', margin: 'auto', width: '60%', height: '60%' };
  
  const [mode, setMode] = useState(ViewMode.List);
  
  return (
    <div style={style}>
        <div className="NavigationBar">
          <ViewController views={[ViewMode.List, ViewMode.Map]} setViewMode={(mode) => setMode(mode)} />
          <Button colorScheme='blue' style={{ height: '90%' }} onClick={onClose}>
            <AiOutlineClose width='100%' height='100%' />
          </Button>
        </div>
        <div className='Container'>
          <List events={events} isActive={mode === ViewMode.List} />
          <Map events={events} isActive={mode === ViewMode.Map} prefix={"secondary"} />
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
          { tags.map((t, idx) => <Tag key={`tag-${idx}`} value={t} />) }
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
        <div style={{display:'flex'}}>
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
              <PopoverHeader>What events are you looking for? <br/> The one that...</PopoverHeader>
              <PopoverBody>
                <div>
                  <div>
                    <p>Starting from: </p>
                    <Input placeholder="Select Date and Time" size="md" type="datetime-local" />
                  </div>

                  <div>
                    <p>Will cost between: </p>
                    <RangeSlider aria-label={['min', 'max']} defaultValue={[10, 30]}>
                      <RangeSliderTrack>
                        <RangeSliderFilledTrack />
                      </RangeSliderTrack>
                      <RangeSliderThumb index={0} />
                      <RangeSliderThumb index={1} />
                    </RangeSlider>
                  </div>

                  <div>
                    <p>Related to: </p>
                    {['category1', 'category2', 'category3', 'category4', 'category5', 'category6'].map((c, idx) => <Tag key={`tag-${idx}`} value={c} />)}
                  </div>
                </div>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </div>
        
        <Button colorScheme='blue' style={{ height: '90%' }}>
          <AiOutlineClear width='100%' height='100%' />
        </Button>
      </div>
        

      <Popup content={popupItems ? <PopupContent onClose={() => setShowSelection(false)} events={popupItems} /> : null} 
             isShow={showSelection} 
             onClose={() => setShowSelection(false)} />
      <SelectionConfirmation position={popupPosition} selection={popupItems} onConfirm={onConfirm} onClose={onClose} />
      <div className='Container'>
        <Calendar events={events} date={date} 
                  onStopSelection={onStopSelection} onStartSelection={closePopup}
                  onSelection={onSelection}
                  renderHeader={renderHeader} renderCell={renderDay}
                  isActive={mode === ViewMode.Calendar} />
        <List events={events} isActive={mode === ViewMode.List} />
        <Map events={events} onEventClick={onStopSelection} isActive={mode === ViewMode.Map} prefix={"main"} />
      </div>

    </div>
  );
}

export default App;
