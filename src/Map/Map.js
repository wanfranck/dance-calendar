import { useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useEffect } from 'react';

import { Button } from 'react-bootstrap';

import { IoIosArrowUp } from 'react-icons/io';
import { AiOutlineInfoCircle } from 'react-icons/ai';

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

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

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

const legendItems = [
    { title: 'camp', src: Class },
    { title: 'battle', src: Battle },
    { title: 'lab', src: Lab },
    { title: 'other', src: Unknown },
];

function MapLegend({ items }) {
    const [isOpened, setIsOpened] = useState(false);

    const itemStyle = {
        display: 'flex',
        justifyContent: 'left',
        gap: '20%',
    };
    const itemImageStyle = { width: '15px', height: '15px' };

    const widthStyle = isOpened
        ? { width: '20%', minWidth: '90px', maxWidth: '100px' }
        : { height: '40px', width: '45px', padding: '0px' };

    return (
        <div className="legend" style={widthStyle}>
            {!isOpened ? (
                <Button
                    variant="light"
                    style={{
                        height: '40px',
                        width: '45px',
                        padding: '0px',
                    }}
                    onClick={(_) => setIsOpened(true)}
                >
                    <AiOutlineInfoCircle width="100%" height="100%" />
                </Button>
            ) : (
                <div>
                    {items.map((item) => (
                        <div key={`${item.title}-key`} style={itemStyle}>
                            <div>
                                <img
                                    src={item.src}
                                    alt={item.title}
                                    style={itemImageStyle}
                                />
                            </div>
                            <div>{item.title}</div>
                        </div>
                    ))}
                    <Button
                        variant="light"
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            width: '100%',
                            height: '20px',
                            padding: '0px',
                            marginTop: '10px',
                        }}
                        onClick={(_) => setIsOpened(false)}
                    >
                        <IoIosArrowUp />
                    </Button>
                </div>
            )}
        </div>
    );
}

function Map({
    events,
    location,
    isActive,
    onSelection,
    prefix,
    windowSize,
    hoverLocation,
    onEnter,
    onLeave,
}) {
    const map = useRef(null);
    const hoverMarker = useRef(null);
    const [isLoaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!isLoaded) return;

        map.current.resize();
    }, [windowSize, isActive, isLoaded]);

    useEffect(() => {
        if (map.current) return;

        map.current = new mapboxgl.Map({
            container: `map-${prefix}`,
            style: 'mapbox://styles/mapbox/light-v11',
            center: location,
            zoom: 3,
        });

        map.current.on('load', () => {
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
        const enterListener = (event) => onEnter(event);
        map.current.on(
            'mouseenter',
            ['events', 'selected-events'],
            enterListener
        );

        const leaveListener = (event) => onLeave(event);
        map.current.on(
            'mouseleave',
            ['events', 'selected-events'],
            leaveListener
        );

        return () => {
            map.current.off(
                'mouseenter',
                ['events', 'selected-events'],
                enterListener
            );
            map.current.off(
                'mouseleave',
                ['events', 'selected-events'],
                leaveListener
            );
        };
    }, [events, onEnter, onLeave]);

    useEffect(() => {
        if (!isLoaded) return;

        const source = map.current.getSource('events');
        if (events.length) {
            const sourceData = sourceFromEvents(events);
            if (!source) {
                map.current.addSource('events', {
                    type: 'geojson',
                    data: sourceData,
                });

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
            } else {
                source.setData(sourceData);
            }
        } else {
            if (source) {
                map.current.removeLayer('events');
                map.current.removeSource('events');
            }
        }
    }, [events, isLoaded, isActive]);

    useEffect(() => {
        if (!isLoaded) return;

        map.current.flyTo({
            center: location,
            essential: true,
            zoom: location.zoom,
        });

        if (location.isUserLocation) {
            new mapboxgl.Marker({ color: 'red' })
                .setLngLat(location)
                .addTo(map.current);
        }
    }, [location, isLoaded, isActive]);

    useEffect(() => {
        if (!isLoaded) return;

        if (hoverMarker && hoverMarker.current) hoverMarker.current.remove();

        if (hoverLocation) {
            hoverMarker.current = new mapboxgl.Marker({ color: '#E8AA42' })
                .setLngLat(hoverLocation)
                .addTo(map.current);
        }
    }, [hoverLocation, isLoaded]);

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'block',
                position: 'relative',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            }}
        >
            <MapLegend items={legendItems} />
            <div
                className={`Map ${isActive ? '' : 'Hidden'}`}
                id={`map-${prefix}`}
            />
        </div>
    );
}

export default Map;
