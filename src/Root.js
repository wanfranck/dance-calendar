import { useState, useEffect } from 'react'

import getEvents from './Events/Events'
import App from './App'

function Root() {
    const [events, setEvents] = useState([])

    useEffect(() => {
        async function loadEvents() {
            console.log('Getting events...')
            const loadedEvents = await getEvents()
            console.log('Finished.')
            console.log('Events: ', loadedEvents)
            setEvents(loadedEvents)
        }

        loadEvents()
    }, [])

    return <App events={events} />
}

export default Root
