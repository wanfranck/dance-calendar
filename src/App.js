import { useCallback, useEffect, useState } from 'react';
import { add, format, parse } from 'date-fns';
import { Button } from 'react-bootstrap';
import {
    AiOutlineClear,
    AiOutlineSend,
    AiOutlineInfoCircle,
    AiOutlineUnorderedList,
} from 'react-icons/ai';
import { RiMapPinLine } from 'react-icons/ri';
import { isMobile } from 'react-device-detect';

import Calendar from './Calendar';
import List from './List';
import Map from './Map';
import FilterControl from './FilterControl';
import { isDayInEventDuration, isEventInDay } from './Utils/EventUtils';
import {
    isCurrentDay,
    getFirstDayOfMonth,
    getCalendarDays,
} from './Utils/TimeUtils';
import { useWindowSize } from './Utils/ReactUtils';
import logoImg from './Icons/logo.png';
import { dateFormat, filterWidths } from './constants';

import './App.css';

const MAP_CHANGE_SELECTION = true;

const getTimeRangedEvents = (events, currentDate, lookAhead) => {
    const lastMonth = add(currentDate, { months: lookAhead });
    const timeRange = [
        getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()),
        getFirstDayOfMonth(lastMonth.getFullYear(), lastMonth.getMonth()),
    ];

    return events.filter((event) => {
        const date = parse(event.date, dateFormat, new Date());
        return date >= timeRange[0] && date < timeRange[1];
    });
};

const App = ({ events, showInfo }) => {
    const size = useWindowSize();
    const [currentDate, setDate] = useState(new Date());
    const [currentLocation, setLocation] = useState({
        lat: 45.60007662094233,
        lng: 10.709870250868335,
        zoom: 3,
        isUserLocation: false,
    });

    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedEvents, setSelectedEvents] = useState([]);

    const [selection, setDaysSelection] = useState([]);
    const [tagsFilter, setTagsFilter] = useState([]);
    const [chosenTags, setChosenTags] = useState([]);
    const [hoverLocation, setHoverLocation] = useState(null);
    const [hoverDuration, setHoverDuration] = useState([]);

    const [isListView, setIsListView] = useState(true);

    const countLookAhead = (size) => {
        if (size.width < 800) return 1;
        if (size.width < 1150) return 2;

        return 3;
    };
    const lookAhead = countLookAhead(size);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setLocation({
                lat: latitude,
                lng: longitude,
                zoom: 3,
                isUserLocation: true,
            });
        });
    }, []);

    useEffect(() => {
        const allTags = events.reduce(
            (acc, ev) => new Set([...new Set(ev.tags), ...acc]),
            new Set()
        );

        setTagsFilter([...allTags]);
    }, [events]);

    useEffect(() => {
        setFilteredEvents(
            getTimeRangedEvents(events, currentDate, lookAhead).filter(
                (event) =>
                    chosenTags.every((tag) => event.tags.indexOf(tag) !== -1)
            )
        );
    }, [events, currentDate, chosenTags, lookAhead]);

    const onCalendarSelection = useCallback(
        (e, dates) => {
            const isAdd = true || isMobile || e.ctrlKey || e.metaKey;

            const alreadySelectedDates = dates.filter((d) =>
                selection.some((sd) => sd.getTime() === d.getTime())
            );
            const appearedDates = dates.filter((d) =>
                selection.every((sd) => sd.getTime() !== d.getTime())
            );

            const newSelection = isAdd
                ? appearedDates.length
                    ? selection.concat(appearedDates)
                    : selection.filter(
                          (d) =>
                              !alreadySelectedDates.some(
                                  (sd) => sd.getTime() === d.getTime()
                              )
                      )
                : dates;
            const newItems = events.filter((event) =>
                newSelection.some((day) => isEventInDay(event, day))
            );

            setDaysSelection(newSelection);
            setSelectedEvents(newItems);
        },
        [events, selection]
    );

    const onMapSelection = useCallback(
        (event) => {
            if (!MAP_CHANGE_SELECTION) {
                return;
            }

            const { originalEvent, features } = event;
            const isAdd =
                isMobile || originalEvent.ctrlKey || originalEvent.metaKey;

            const newEvents = features.map(({ properties }) => ({
                ...properties,
                /* eslint-disable */
                tags: eval(properties.tags),
                coordinates: eval(properties.coordinates),
                /* eslint-enable */
            }));

            const allIsSelected = newEvents.every((event) => event.isSelected);

            const newSelection = isAdd
                ? allIsSelected
                    ? selectedEvents.filter((event) =>
                          newEvents.every((e) => e.id !== event.id)
                      )
                    : [
                          ...selectedEvents,
                          ...newEvents.filter((event) =>
                              selectedEvents.every((e) => e.id !== event.id)
                          ),
                      ]
                : newEvents;
            const newItems = newSelection.reduce((acc, event) => {
                const eventDate = parse(event.date, dateFormat, new Date());
                const alreadyHas = acc.some(
                    (date) => date.getTime() === eventDate.getTime()
                );
                return alreadyHas ? acc : [...acc, eventDate];
            }, []);

            setDaysSelection(newItems);
            setSelectedEvents(newSelection);
        },
        [selectedEvents]
    );

    const onListHover = useCallback(
        (event, item) => {
            setHoverLocation(item.coordinates);
            const date = parse(item.date, dateFormat, new Date());
            const endDate = parse(item.endDate, dateFormat, new Date());
            const duration = [date, endDate];
            setHoverDuration(duration);
        },
        [setHoverLocation]
    );

    const onClearSelection = (_) => {
        setChosenTags([]);
        setDaysSelection([]);
        setSelectedEvents([]);
        setFilteredEvents(getTimeRangedEvents(events, currentDate, lookAhead));
    };

    const onSetTagFilter = (tag) => {
        const newChosenTags = [
            ...new Set([
                ...chosenTags.filter((t) => [tag].indexOf(t) === -1),
                ...[tag].filter((t) => chosenTags.indexOf(t) === -1),
            ]),
        ];
        const timeRangedEvents = getTimeRangedEvents(
            events,
            currentDate,
            lookAhead
        );

        setChosenTags(newChosenTags);
        setFilteredEvents(
            newChosenTags.length
                ? timeRangedEvents.filter((event) =>
                      newChosenTags.every(
                          (tag) => event.tags.indexOf(tag) !== -1
                      )
                  )
                : timeRangedEvents
        );
    };

    const renderDay = useCallback(
        (date) => {
            const dayEvents = filteredEvents.filter((ev) =>
                isEventInDay(ev, date)
            );
            const isSelected = selection.filter(
                (selectedDate) => selectedDate.getTime() === date.getTime()
            ).length;

            let cellColor = 'white';
            let fontColor = 'black';

            if (isDayInEventDuration(date, hoverDuration)) {
                cellColor = '#f2d097';
                fontColor = '#025464';
            } else if (isSelected) {
                cellColor = '#E8AA42';
                fontColor = 'white';
            } else if (dayEvents.length) {
                cellColor = '#025464';
                fontColor = 'white';
            }

            const dayStyle = {
                display: 'flex',
                position: 'relative',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center',
                width: '100%',
                height: '100%',
                color: fontColor,
                backgroundColor: cellColor,
                border: isDayInEventDuration(date, hoverDuration)
                    ? '4px solid #025464'
                    : isCurrentDay(date)
                    ? '3px solid #E57C23'
                    : 'solid #d3d4d5 1px',
                borderRadius: '4px',
            };

            return (
                <div style={dayStyle}>
                    <div>{format(date, 'd')}</div>
                </div>
            );
        },
        [filteredEvents, selection, hoverDuration]
    );

    const renderHeader = (date, item, weekDayIdx) => {
        const weekdayInMonth = getCalendarDays(date).filter(
            (day) =>
                day.getMonth() === date.getMonth() &&
                day.getDay() === weekDayIdx
        );

        const selectedWeekdaysOfMonth = selection.filter(
            (day) =>
                day.getMonth() === date.getMonth() &&
                day.getDay() === weekDayIdx
        );

        const isSelected =
            weekdayInMonth.length === selectedWeekdaysOfMonth.length;

        const cellColor = isSelected ? '#E8AA42' : 'white';
        const fontColor = isSelected ? 'white' : 'black';

        return (
            <div
                key={`header-${item}`}
                style={{
                    height: '100%',
                    width: '100%',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    border: 'solid #d3d4d5 1px',
                    borderRadius: '4px',
                    color: fontColor,
                    backgroundColor: cellColor,
                }}
            >
                {item}
            </div>
        );
    };

    const renderTitle = (date) => {
        const monthDays = getCalendarDays(date).filter(
            (d) => d.getMonth() === date.getMonth()
        );
        const monthDaysInSelection = monthDays.filter((d) =>
            selection.some((md) => md.getTime() === d.getTime())
        );
        const isSelected = monthDaysInSelection.length === monthDays.length;

        const cellColor = isSelected ? '#E8AA42' : 'white';
        const fontColor = isSelected ? 'white' : 'black';

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    backgroundColor: cellColor,
                    color: fontColor,
                }}
            >
                <div>{format(date, 'MMMM')}</div>
            </div>
        );
    };

    const mapContainerStyle = {
        position: 'absolute',
        display: !isListView ? 'block' : 'none',
        width: '100%',
        height: '100%',
    };
    const listContainerStyle = {
        position: 'absolute',
        display: isListView ? 'block' : 'none',
        width: '100%',
        height: '100%',
    };
    const upperSection = { width: '100%', height: '40%', marginBottom: '1px' };
    const lowerSection = {
        width: '100%',
        height: '60%',
        margin: '1px 0 0 0',
        position: 'relative',
    };

    const isEventSelected = (event) => {
        return selectedEvents.some((ev) => ev.id === event.id);
    };

    const mappedEvents = filteredEvents.map((ev) => ({
        ...ev,
        isSelected: isEventSelected(ev),
    }));
    mappedEvents.sort((lhs, rhs) => {
        const lhsSelected = isEventSelected(lhs);
        const rhsSelected = isEventSelected(rhs);
        return rhsSelected === lhsSelected ? 0 : lhsSelected ? -1 : 1;
    });

    const navBarButtonStyle = {
        height: '40px',
        width: '45px',
    };
    const logoImageStyle = { height: '30px', width: '30px' };

    return (
        <div className="App">
            <div className="NavigationBar">
                <div
                    style={{
                        width: '80%',
                        margin: 'auto',
                        display: 'flex',
                        gap: '5px',
                    }}
                >
                    <Button
                        variant="light"
                        style={{ ...navBarButtonStyle, padding: '0px' }}
                        onClick={(_) =>
                            window.open(
                                'https://www.instagram.com/_dance.calendar/'
                            )
                        }
                    >
                        <img
                            src={logoImg}
                            style={logoImageStyle}
                            alt={'Application Logo'}
                        />
                    </Button>
                    <FilterControl
                        date={currentDate}
                        tags={tagsFilter.map((tag) => ({
                            value: tag,
                            isActive: chosenTags.indexOf(tag) !== -1,
                        }))}
                        onChangeFilter={(tag) => onSetTagFilter(tag)}
                        width={filterWidths[lookAhead - 1]}
                    />
                    <Button
                        variant="light"
                        style={navBarButtonStyle}
                        onClick={(event) => onClearSelection(event)}
                    >
                        <AiOutlineClear width="100%" height="100%" />
                    </Button>
                    <Button
                        variant="light"
                        style={navBarButtonStyle}
                        onClick={showInfo}
                    >
                        <AiOutlineInfoCircle width="100%" height="100%" />
                    </Button>
                    <Button
                        variant="light"
                        style={navBarButtonStyle}
                        onClick={(_) =>
                            window.open('https://forms.gle/8SHYRZjKF89iS3598')
                        }
                    >
                        <AiOutlineSend width="100%" height="100%" />
                    </Button>
                </div>
            </div>

            <div className="Container">
                <div style={upperSection}>
                    <Calendar
                        prefix={'main'}
                        onSelection={onCalendarSelection}
                        onSetDate={(date) => setDate(date)}
                        renderDay={renderDay}
                        renderHeader={renderHeader}
                        renderTitle={renderTitle}
                        date={currentDate}
                        lookAhead={lookAhead}
                        isActive={true}
                    />
                </div>

                <div style={lowerSection}>
                    <Button
                        variant="light"
                        style={{
                            height: '40px',
                            width: '45px',
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            zIndex: '2',
                            padding: '0px',
                        }}
                        onClick={(_) => setIsListView(!isListView)}
                    >
                        {isListView ? (
                            <RiMapPinLine width="100%" height="100%" />
                        ) : (
                            <AiOutlineUnorderedList
                                width="100%"
                                height="100%"
                            />
                        )}
                    </Button>
                    <div style={mapContainerStyle}>
                        <Map
                            prefix={'main'}
                            events={mappedEvents}
                            onSelection={onMapSelection}
                            isActive={!isListView}
                            windowSize={size}
                            location={currentLocation}
                            hoverLocation={hoverLocation}
                            onEnter={(event) => {
                                const { features } = event;
                                const item = features[0].properties;
                                const date = parse(
                                    item.date,
                                    dateFormat,
                                    new Date()
                                );
                                const endDate = parse(
                                    item.endDate,
                                    dateFormat,
                                    new Date()
                                );
                                const duration = [date, endDate];
                                setHoverDuration(duration);
                            }}
                            onLeave={(e) => {
                                setHoverDuration([]);
                            }}
                        />
                    </div>
                    <div style={listContainerStyle}>
                        <List
                            prefix={'main'}
                            events={mappedEvents}
                            onItemClick={(item) => window.open(item.link)}
                            isActive={isListView}
                            onHover={onListHover}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
