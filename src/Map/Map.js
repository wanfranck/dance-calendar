import { useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useEffect } from 'react';

import 'mapbox-gl/src/css/mapbox-gl.css';
import './Map.css';

import { bbox, lineString } from '@turf/turf';

mapboxgl.accessToken = 'pk.eyJ1IjoiYW50b24tbGFzaGNoYW5rYSIsImEiOiJjbGY1anhha3MwbGpoM3lxaGZmaHM4dWliIn0.JyEoFVACqTIpRpTZzSIFvg';

function sourceFromEvents(events) {
    const features = events.map(event => ({ type: 'Feature', properties: event, geometry: { type: 'Point', coordinates: event.coordinates } }));
    return {
        'type': 'FeatureCollection',
        'features': features
    };
}

function Map({ currentEvents, selectedEvents, isActive, onSelection, prefix, windowSize }) {
    const map = useRef(null);
    const [isLoaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!isLoaded) return;
        
        map.current.resize();
    }, [windowSize, isLoaded]);
    
    useEffect(() => {
        if (map.current) return;

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

            setLoaded(true);
        });
    });

    useEffect(() => {
        const listener = (event) => onSelection(event);
        map.current.on('click', ['events', 'selected-events'], listener);
        return () => {
            map.current.off('click', ['events', 'selected-events'], listener);
        }
    }, [currentEvents, selectedEvents, onSelection]);

    useEffect(() => {
        if (!isLoaded) return;
        
        const source = map.current.getSource('events');
        const sourceData = sourceFromEvents(currentEvents);
        source.setData(sourceData);

        if (!currentEvents.length) return;

        if (currentEvents.length > 1) {
            const bboxInput = sourceData;
            const deltas = [-1e-3, -1e-3, 1e-3, 1e-3];    
            const bboxData = bbox(lineString(bboxInput.features.map(f => f.geometry.coordinates))).map((coord, idx) => coord + deltas[idx]);
            map.current.fitBounds(bboxData);
        } else if (currentEvents.length === 1) {
            map.current.flyTo({
                center: currentEvents[0].coordinates,
                essential: true,
                zoom: 12
            });
        }
    }, [currentEvents, isLoaded, isActive]);

    useEffect(() => {
        if (!isLoaded) return;
    
        const selectedSource = map.current.getSource('selected-events');
        const selectedSourceData = sourceFromEvents(selectedEvents);
        selectedSource.setData(selectedSourceData); 
    }, [selectedEvents, isActive, isLoaded]);

    return (
        <div className={`Map ${isActive ? '' : 'Hidden'}`} id={`map-${prefix}`} />
    );
}

export default Map;