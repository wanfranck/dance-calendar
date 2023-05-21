import React, { useCallback, useEffect, useState } from 'react'
import { add, format, parse } from 'date-fns'

import './App.css'

import Calendar from './Calendar'
import List from './List'
import Map from './Map'
import FilterControl from './FilterControl'

import { isEventInDay } from './Utils/EventUtils'
import { isCurrentDay, getFirstDayOfMonth } from './Utils/TimeUtils'
import { useWindowSize } from './Utils/ReactUtils'

import { Button } from 'react-bootstrap'
import { AiOutlineClear } from 'react-icons/ai'

const App = ({ events }) => {
    const size = useWindowSize()
    const [currentDate, setDate] = useState(new Date())

    const [filteredEvents, setFilteredEvents] = useState([])
    const [selectedEvents, setSelectedEvents] = useState([])

    const [selection, setDaysSelection] = useState([])
    const [tagsFilter, setTagsFilter] = useState([])
    const [chosenTags, setChosenTags] = useState([])

    const getTimeRangedEvents = (events, currentDate) => {
        const lastMonth = add(currentDate, { months: 3 })
        const timeRange = [
            getFirstDayOfMonth(
                currentDate.getFullYear(),
                currentDate.getMonth()
            ),
            getFirstDayOfMonth(lastMonth.getFullYear(), lastMonth.getMonth()),
        ]

        return events.filter((event) => {
            const date = parse(event.date, 'dd-MM-yyyy', new Date())
            return date >= timeRange[0] && date < timeRange[1]
        })
    }

    useEffect(() => {
        setFilteredEvents(getTimeRangedEvents(events, currentDate))

        const allTags = events.reduce(
            (acc, ev) => new Set([...new Set(ev.tags), ...acc]),
            new Set()
        )
        setTagsFilter([...allTags])
    }, [events, currentDate])

    const onCalendarSelection = (e, dates) => {
        const isAdd = e.ctrlKey || e.metaKey

        const newSelection = isAdd ? selection.concat(dates) : dates
        const newItems = events.filter((event) =>
            newSelection.some((day) => isEventInDay(event, day))
        )

        setDaysSelection(newSelection)
        setSelectedEvents(newItems)
    }

    const onMapSelection = useCallback(
        (event) => {
            const { originalEvent, features } = event
            const isAdd = originalEvent.ctrlKey || originalEvent.metaKey

            const newEvents = features.map(({ properties }) => ({
                ...properties,
                tags: eval(properties.tags),
                coordinates: eval(properties.coordinates),
            }))

            const newSelection = isAdd
                ? [...selectedEvents, ...newEvents]
                : newEvents
            const newItems = newSelection.reduce((acc, event) => {
                const eventDate = parse(event.date, 'dd-MM-yyyy', new Date())
                const alreadyHas = acc.some(
                    (date) => date.getTime() === eventDate.getTime()
                )
                return alreadyHas ? acc : [...acc, eventDate]
            }, [])

            setDaysSelection(newItems)
            setSelectedEvents(newSelection)
        },
        [selectedEvents]
    )

    const onClearSelection = (_) => {
        setChosenTags([])
        setDaysSelection([])
        setSelectedEvents([])
        setFilteredEvents(getTimeRangedEvents(events, currentDate))
    }

    const onSetTagFilter = (tag) => {
        const newChosenTags = [
            ...new Set([
                ...chosenTags.filter((t) => [tag].indexOf(t) === -1),
                ...[tag].filter((t) => chosenTags.indexOf(t) === -1),
            ]),
        ]
        const timeRangedEvents = getTimeRangedEvents(events, currentDate)

        setChosenTags(newChosenTags)
        setFilteredEvents(
            newChosenTags.length
                ? timeRangedEvents.filter((event) =>
                      newChosenTags.every(
                          (tag) => event.tags.indexOf(tag) !== -1
                      )
                  )
                : timeRangedEvents
        )
    }

    const renderDay = (date) => {
        const dayEvents = filteredEvents.filter((ev) => isEventInDay(ev, date))
        const isSelected = selection.filter(
            (selectedDate) => selectedDate.getTime() === date.getTime()
        ).length
        const cellColor = isSelected
            ? '#E8AA42'
            : dayEvents.length
            ? '#025464'
            : 'white'
        const fontColor = isSelected
            ? 'white'
            : dayEvents.length
            ? 'white'
            : 'black'
        const dayStyle = {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%',
            height: '100%',
            color: fontColor,
            backgroundColor: cellColor,
            border: isCurrentDay(date)
                ? '2px solid #E57C23'
                : 'solid #d3d4d5 1px',
            borderRadius: '4px',
        }

        return (
            <div style={dayStyle}>
                <div> {format(date, 'd')} </div>
            </div>
        )
    }

    const countLookAhead = (size) => {
        if (size.width < 800) return 1
        if (size.width < 1150) return 2

        return 3
    }
    const lookAhead = countLookAhead(size)

    const isSmall = size.width < 1150
    const mapContainerStyle = {
        width: isSmall ? '100%' : '60%',
        height: isSmall ? '50%' : '100%',
        [isSmall ? 'marginBottom' : 'marginRight']: '1px',
    }
    const listContainerStyle = {
        width: isSmall ? '100%' : '40%',
        height: isSmall ? '50%' : '100%',
        [isSmall ? 'marginTop' : 'marginLeft']: '1px',
    }
    const upperSection = { width: '100%', height: '40%', marginBottom: '1px' }
    const lowerSection = {
        display: 'flex',
        flexDirection: isSmall ? 'column' : 'row',
        width: '100%',
        height: isSmall ? '100%' : '60%',
        marginTop: '1px',
    }

    const isEventSelected = (event) => {
        return selectedEvents.some((ev) => ev.id === event.id)
    }

    const mappedEvents = filteredEvents.map((ev) => ({
        ...ev,
        isSelected: isEventSelected(ev),
    }))
    mappedEvents.sort((lhs, rhs) => {
        if (isEventSelected(lhs) && !isEventSelected(rhs)) {
            return -1
        } else if (isEventSelected(rhs) && isEventSelected(lhs)) {
            return 1
        }

        return 0
    })

    return (
        <div className="App">
            <div className="NavigationBar" style={{ gap: '2px' }}>
                <div>
                    <Button
                        variant="light"
                        style={{ height: '100%' }}
                        onClick={(event) => onClearSelection(event)}
                    >
                        <AiOutlineClear width="100%" height="100%" />
                    </Button>
                </div>
                <div style={{ display: 'flex' }}>
                    <FilterControl
                        date={currentDate}
                        tags={tagsFilter.map((tag) => ({
                            value: tag,
                            isActive: chosenTags.indexOf(tag) !== -1,
                        }))}
                        onChangeDate={(d) => setDate(d)}
                        onChangeFilter={(tag) => onSetTagFilter(tag)}
                        onClearSelection={onClearSelection}
                    />
                </div>
            </div>

            <div className="Container">
                <div style={upperSection}>
                    <Calendar
                        prefix={'main'}
                        onSelection={onCalendarSelection}
                        onSetDate={(date) => setDate(date)}
                        renderDay={renderDay}
                        date={currentDate}
                        lookAhead={lookAhead}
                        isActive={true}
                    />
                </div>

                <div style={lowerSection}>
                    <div style={mapContainerStyle}>
                        <Map
                            prefix={'main'}
                            events={mappedEvents}
                            onSelection={onMapSelection}
                            isActive={true}
                            windowSize={size}
                        />
                    </div>
                    <div style={listContainerStyle}>
                        <List
                            prefix={'main'}
                            events={mappedEvents}
                            onItemClick={(item) => window.open(item.link)}
                            isActive={true}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
