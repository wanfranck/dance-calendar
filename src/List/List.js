import './List.css';

import { BsInstagram } from 'react-icons/bs';

import { useHover } from '../Utils/ReactUtils';
import { useState } from 'react';
import { isMobile } from 'react-device-detect';

function ListItem({ item, isSelected, onClick }) {
    const [hoverRef, isHovered] = useHover();
    const [isHighlighted, setIsHighlighted] = useState(false);
    const showDetails = (!isMobile && isHovered) || (isMobile && isHighlighted);

    const onClickHandler = (event, item) => {
        if (!showDetails) return;

        onClick(event, item);
    };

    const rootItemStyle = {
        display: 'inline-block',
        flexDirection: 'column',
        borderRadius: '4px',
        border: `solid ${isSelected ? '#E8AA42 2px' : '#d3d4d5 1px'}`,
    };

    const mobileOnClick = (e) => {
        if (!isMobile) return;
        setIsHighlighted(!isHighlighted);
    };

    return (
        <div
            ref={hoverRef}
            className="Item Element"
            style={rootItemStyle}
            onClick={mobileOnClick}
        >
            <img
                alt="Item Logo"
                className={`image ${showDetails ? 'image-hovered' : ''}`}
                src={item.image}
            />
            <div className={`middle ${showDetails ? 'middle-hovered' : ''}`}>
                <div style={{ fontSize: '20px', fontWeight: '500' }}>
                    <div>{item.title}</div>
                    <div style={{ fontWeight: '600' }}>{item.date}</div>
                </div>
                <div onClick={(event) => onClickHandler(event, item)}>
                    <BsInstagram
                        style={{
                            width: '35px',
                            height: '35px',
                            cursor: 'pointer',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

function List({ prefix, events, onItemClick }) {
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

    const items = groupedEvents.selected
        .map((item) => (
            <ListItem
                key={`list-item-${item.id}`}
                isSelected={item.isSelected}
                item={item}
                onClick={(event, item) => onClickHandler(event, item)}
            />
        ))
        .concat(
            groupedEvents.rest.map((item) => (
                <ListItem
                    key={`list-item-${item.id}`}
                    isSelected={item.isSelected}
                    item={item}
                    onClick={(event, item) => onClickHandler(event, item)}
                />
            ))
        );

    let rows = [];
    const chunkSize = 2;
    for (let i = 0; i < items.length; i += chunkSize) {
        const chunk = items.slice(i, i + chunkSize);
        rows.push(
            <div key={`row-${i}`} className="Row">
                {chunk}
            </div>
        );
    }

    return (
        <div key={`list-${prefix}`} className={`List`}>
            {rows}
        </div>
    );
}

export default List;
