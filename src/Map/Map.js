import { useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useEffect } from 'react';

import 'mapbox-gl/src/css/mapbox-gl.css';
import './Map.css';

function sourceFromEvents(events) {
    return {
        'type': 'FeatureCollection',
        'features': events.map(event => ({ type: 'Feature', geometry: { type: 'Point', coordinates: event.coordinates } }))
    };
}

function Map({ events, isActive }) {
    const map = useRef(null);

    useEffect(() => {
        if (map.current) return;

        mapboxgl.accessToken = 'pk.eyJ1IjoiYW50b24tbGFzaGNoYW5rYSIsImEiOiJjbGY1anhha3MwbGpoM3lxaGZmaHM4dWliIn0.JyEoFVACqTIpRpTZzSIFvg';
        map.current = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-74.5, 40],
            zoom: 9,
        });

        map.current.on('load', () => {
            map.current.addSource('events', {
                type: 'geojson',
                data: sourceFromEvents([])
            });

            map.current.addLayer({
                id: 'events',
                source: 'events',
                type: 'circle',
                paint: {
                    'circle-radius': 6,
                    'circle-color': '#B42222'
                },
            });
        });
    });

    useEffect(() => {
        if (!map.current) return;

        const source = map.current.getSource('events');

        if (!source) return;

        if (events.length) {
            source.setData(sourceFromEvents(events));
            map.current.flyTo({
                center: events[0].coordinates,
                essential: true
            });
        }
    }, [events, isActive]);

    return (
        <div className={`Map ${isActive ? '' : 'Hidden'}`} id='map' />
    );
}

export default Map;