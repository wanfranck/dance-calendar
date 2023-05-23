import './List.css';

import Tag from '../Tag';
import { useState } from 'react';
import { BsInstagram } from 'react-icons/bs';

function ListItem({ item, isSelected, onClick }) {
    const [isCollapsed, setCollapsed] = useState(true);

    const rootItemStyle = {
        display: 'inline-block',
        flexDirection: 'column',
        backgroundColor: isSelected ? '#d3d4d5' : 'white',
        borderRadius: isCollapsed ? '4px' : '4px 4px 0 0'
    };

    const itemPreview = {
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        cursor: 'pointer',
    };

    const itemTitleStyle = {
        padding: '2px 10px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%',
    };

    const itemDescriptionStyle = {
        display: 'block',
        overflow: 'hidden',
        height: isCollapsed ? '0px' : 'fit-content',
        backgroundColor: isSelected ? '#d3d4d5' : 'white',
        borderRadius: '0 0 4px 4px',
    };

    return (
        <div className="Item Element" style={rootItemStyle}>
            <div
                style={itemPreview}
                onClick={(_) => setCollapsed(!isCollapsed)}
            >
                <div style={{ display: 'flex' }}>
                    <img
                        alt="Item"
                        style={{ height: '100%', objectFit: 'contain' }}
                        src={item.image}
                    />

                    <div style={itemTitleStyle}>
                        <div
                            style={{
                                height: '100%',
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <div style={{ height: '33%' }}> {item.title} </div>
                            <div style={{ height: '33%' }}>
                                <b> {item.date} </b>
                            </div>
                            <div
                                style={{
                                    height: '33%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}
                            >
                                <BsInstagram
                                    onClick={(event) => onClick(event, item)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={itemDescriptionStyle}>
                <div style={{ display: 'flex', marginTop: '5px' }}>
                    {item.tags.map((t, idx) => (
                        <Tag key={`tag-${idx}`} value={t} />
                    ))}
                </div>
                <div style={{ padding: '0 5px' }}>{item.description}</div>
            </div>
        </div>
    );
}

function List({ prefix, events, onItemClick, isActive }) {
    const onClickHandler = (event, item) => {
        onItemClick(item);
        event.preventDefault();
        event.stopPropagation();
    };

    const groupedEvents = events.reduce(
        (acc, event) =>
            event.isSelected
                ? { ...acc, selected: [...acc.selected, event] }
                : { ...acc, rest: [...acc.rest, event] },
        { selected: [], rest: [] }
    );

    return (
        <div
            key={`list-${prefix}`}
            className={`List ${isActive ? '' : 'Hidden'}`}
            style={{ border: 'solid #d3d4d5 1px', borderRadius: '4px', padding: '2px' }}
        >
            {groupedEvents.selected.map((item, idx) => (
                <ListItem
                    key={`list-item-${idx}`}
                    isSelected={item.isSelected}
                    item={item}
                    onClick={(event, item) => onClickHandler(event, item)}
                />
            ))}
            {groupedEvents.rest.map((item, idx) => (
                <ListItem
                    key={`list-item-${idx}`}
                    isSelected={item.isSelected}
                    item={item}
                    onClick={(event, item) => onClickHandler(event, item)}
                />
            ))}
        </div>
    );
}

export default List;
