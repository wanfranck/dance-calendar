import { useState, useEffect } from 'react';

import getEvents, { imageLink } from './Events/Events';
import App from './App';

import { useLocalStorage } from './Utils/ReactUtils';

import { AiOutlineClose } from 'react-icons/ai';
import { IconContext } from 'react-icons';
import { isMobile } from 'react-device-detect';

const examples = [
    {
        id: '1vOXknZQwbPCOhuigWuJ3tEj17OvZBwTJ',
        image: imageLink('1vOXknZQwbPCOhuigWuJ3tEj17OvZBwTJ'),
        title: '1. Сhoose suitable dates',
    },
    {
        id: '1-dmBkfCT8PQsMLan-gxVu6HHlP591tf1',
        image: imageLink('1-dmBkfCT8PQsMLan-gxVu6HHlP591tf1'),
        title: '2. Find convenient locations',
    },
    {
        id: '1URFDCoZUtBHQck-fK9yc22YhiVgNZ5Lq',
        image: imageLink('1URFDCoZUtBHQck-fK9yc22YhiVgNZ5Lq'),
        title: '3. Follow the link to join',
    },
];

function Root() {
    const [events, setEvents] = useState([]);
    const [isVisited, setIsVisited] = useLocalStorage('visited', false);
    const [showInfo, setShowInfo] = useState(!isVisited);

    useEffect(() => {
        if (!isVisited) {
            setIsVisited(true);
        }
    }, [isVisited, setIsVisited]);

    useEffect(() => {
        async function loadEvents() {
            console.log('Getting events...');
            const loadedEvents = await getEvents();
            console.log('Finished.');
            console.log('Events: ', loadedEvents);
            setEvents(loadedEvents);
        }

        loadEvents();
    }, []);

    const instructionActionStyle = {
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'center',
        textAlign: 'center',
        height: '33%',
    };

    const actionTitleStyle = {
        width: isMobile ? 'fit-content' : '30%',
        display: 'flex',
        alignItems: 'center',
        margin: isMobile ? 'auto' : 'none',
    };

    const actionImageStyle = {
        width: isMobile ? '70%' : '30%',
        height: '90%',
        border: 'solid #d3d4d5 1px',
        margin: isMobile ? 'auto' : 'none',
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            {showInfo ? (
                <div
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: isMobile ? '130%' : '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: '3',
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                            width: '80%',
                            height: isMobile ? '70%' : '80%',
                            top: '10%',
                            left: '10%',
                            backgroundColor: 'white',
                            border: 'solid #d3d4d5 1px',
                            borderRadius: '10px',
                            paddingTop: '2%',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                top: '-35px',
                                right: '-35px',
                                width: 'fit-content',
                                height: 'fit-content',
                            }}
                        >
                            <IconContext.Provider value={{ color: 'white' }}>
                                <AiOutlineClose
                                    onClick={(_) => setShowInfo(false)}
                                    style={{
                                        width: '35px',
                                        height: '35px',
                                    }}
                                />
                            </IconContext.Provider>
                        </div>

                        {examples.map((example) => (
                            <div
                                key={`inctuction-${example.id}`}
                                style={instructionActionStyle}
                            >
                                <div style={actionTitleStyle}>
                                    <div>{example.title}</div>
                                </div>
                                <div style={actionImageStyle}>
                                    <img
                                        alt="Calendar Example"
                                        className={`image`}
                                        src={example.image}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
            <App events={events} showInfo={() => setShowInfo(true)} />
        </div>
    );
}

export default Root;
