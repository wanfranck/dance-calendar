import { useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useEffect } from 'react';

import 'mapbox-gl/src/css/mapbox-gl.css';
import './Map.css';

import {
    battleImage,
    labImage,
    trainImage,
    defaultImage,
    trainImageSelected,
    battleImageSelected,
    labImageSelected,
    defaultImageSelected,
} from '../Icons';

import Class from './../Icons/class.png';
import Battle from './../Icons/battle.png';
import Lab from './../Icons/lab.png';
import Unknown from './../Icons/unknown.png';

mapboxgl.accessToken =
    'pk.eyJ1IjoiYW50b24tbGFzaGNoYW5rYSIsImEiOiJjbGY1anhha3MwbGpoM3lxaGZmaHM4dWliIn0.JyEoFVACqTIpRpTZzSIFvg';

function sourceFromEvents(events) {
    const features = events.map((event) => ({
        type: 'Feature',
        properties: event,
        geometry: { type: 'Point', coordinates: event.coordinates },
    }));
    return {
        type: 'FeatureCollection',
        features: features,
    };
}

function Map({ events, location, isActive, onSelection, prefix, windowSize }) {
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
            style: 'mapbox://styles/mapbox/light-v11',
            center: location,
            zoom: 9,
        });

        map.current.on('load', () => {
            map.current.addSource('events', {
                type: 'geojson',
                data: sourceFromEvents([]),
            });

            map.current.addImage('train-image', trainImage);
            map.current.addImage('train-image-selected', trainImageSelected);
            map.current.addImage('battle-image', battleImage);
            map.current.addImage('battle-image-selected', battleImageSelected);
            map.current.addImage('lab-image', labImage);
            map.current.addImage('lab-image-selected', labImageSelected);
            map.current.addImage('default-image', defaultImage);
            map.current.addImage(
                'default-image-selected',
                defaultImageSelected
            );

            const getImage = (prefix) => [
                'match',
                ['get', 'type'],
                'camp',
                `train-image${prefix}`,
                'battle',
                `battle-image${prefix}`,
                'lab',
                `lab-image${prefix}`,
                `default-image${prefix}`,
            ];

            map.current.addLayer({
                id: 'events',
                source: 'events',
                type: 'symbol',
                layout: {
                    'icon-image': [
                        'case',
                        ['get', 'isSelected'],
                        getImage('-selected'),
                        getImage(''),
                    ],
                    'icon-size': 0.4,
                    'icon-allow-overlap': true,
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
        };
    }, [events, onSelection]);

    useEffect(() => {
        if (!isLoaded) return;

        const source = map.current.getSource('events');
        const sourceData = sourceFromEvents(events);
        source.setData(sourceData);
    }, [events, isLoaded, isActive]);

    useEffect(() => {
        if (!isLoaded) return;

        const loc = { lat: location.lat, lng: location.lng };

        map.current.flyTo({
            center: loc,
            essential: true,
            zoom: location.zoom,
        });

        if (location.isUserLocation) {
            new mapboxgl.Marker({ color: 'red' })
                .setLngLat(loc)
                .addTo(map.current);
        }
    }, [location, isLoaded, isActive]);

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                border: 'solid #d3d4d5 1px',
                borderRadius: '4px',
            }}
        >
            <div
                className={`Map ${isActive ? '' : 'Hidden'}`}
                id={`map-${prefix}`}
            />
            <div id="state-legend" className="legend">
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'left',
                        gap: '20%',
                    }}
                >
                    <div>
                        <img
                            src={Class}
                            alt="camp"
                            style={{ width: '15px', height: '15px' }}
                        ></img>
                    </div>
                    <div>camp</div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'left',
                        gap: '20%',
                    }}
                >
                    <div>
                        <img
                            src={Battle}
                            alt="battle"
                            style={{ width: '15px', height: '15px' }}
                        ></img>
                    </div>
                    <div>battle</div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'left',
                        gap: '20%',
                    }}
                >
                    <div>
                        <img
                            src={Lab}
                            alt="lab"
                            style={{ width: '15px', height: '15px' }}
                        ></img>
                    </div>
                    <div>lab</div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'left',
                        gap: '20%',
                    }}
                >
                    <div>
                        <img
                            src={Unknown}
                            alt="unknown"
                            style={{ width: '15px', height: '15px' }}
                        ></img>
                    </div>
                    <div>other</div>
                </div>
            </div>
        </div>
    );
}

export default Map;
