import { useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { useEffect } from 'react';

import 'mapbox-gl/src/css/mapbox-gl.css';
import './Map.css';

import { bbox, lineString } from '@turf/turf';
import { ViewMode } from '../ViewController';

function sourceFromEvents(events) {
    const features = events.map(event => ({ type: 'Feature', properties: event, geometry: { type: 'Point', coordinates: event.coordinates } }));
    return {
        'type': 'FeatureCollection',
        'features': features
    };
}

function Map({ events, selectedEvents, isActive, onSelection, onEventClick, prefix }) {
    const map = useRef(null);

    console.log(events, selectedEvents, isActive);

    useEffect(() => {
        if (map.current) return;

        mapboxgl.accessToken = 'pk.eyJ1IjoiYW50b24tbGFzaGNoYW5rYSIsImEiOiJjbGY1anhha3MwbGpoM3lxaGZmaHM4dWliIn0.JyEoFVACqTIpRpTZzSIFvg';
        map.current = new mapboxgl.Map({
            container: `map-${prefix}`,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [-74.5, 40],
            zoom: 9,
        });

        map.current.on('load', () => {
            map.current.addSource('events', {
                type: 'geojson',
                data: sourceFromEvents([])
            });

            map.current.addSource('selected-events', {
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

            map.current.addLayer({
                id: 'selected-events',
                source: 'selected-events',
                type: 'circle',
                paint: {
                    'circle-radius': 6,
                    'circle-color': '#FFA500'
                },
            });

            map.current.on('click', ['events', 'selected-events'] , (e) => {
                const events = e.features.map(({ properties }) => ({ 
                    ...properties,
                    tags: eval(properties.tags), 
                    coordinates: eval(properties.coordinates)
                }));
                onSelection(events, ViewMode.Map);
            });
        });
    });

    useEffect(() => {
        if (!map.current) return;

        const source = map.current.getSource('events');
        const selectedSource = map.current.getSource('selected-events');

        if (!source || !selectedSource) return;

        if (events.length) {
            const notSelectedEvents = events.filter(event => !selectedEvents.some(ev => ev.id === event.id));

            const sourceData = sourceFromEvents(notSelectedEvents);
            source.setData(sourceData);

            const selectedSourceData = sourceFromEvents(selectedEvents);
            selectedSource.setData(selectedSourceData);

            if (selectedEvents.length > 1) {
                const bboxInput = selectedEvents.length ? selectedSourceData : sourceData;
                const deltas = [-1e-3, -1e-3, 1e-3, 1e-3];    
                const bboxData = bbox(lineString(bboxInput.features.map(f => f.geometry.coordinates))).map((coord, idx) => coord + deltas[idx]);
                map.current.fitBounds(bboxData);
            } else if (selectedEvents.length === 1) {
                map.current.flyTo({
                    center: selectedEvents[0].coordinates,
                    essential: true
                });
            }
        }
    }, [selectedEvents, events, isActive]);

    return (
        <div className={`Map ${isActive ? '' : 'Hidden'}`} id={`map-${prefix}`} />
    );
}

export default Map;