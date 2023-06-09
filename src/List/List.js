import './List.css';

import { BsInstagram } from 'react-icons/bs';

import { useHover } from '../Utils/ReactUtils';
import { useState } from 'react';
import { isMobile } from 'react-device-detect';
import IconButton from '@mui/material/IconButton';

function ListItem({
    item,
    isSelected,
    onClick,
    onHover,
    isHighlighted,
    toggleHighlighted,
}) {
    const [hoverRef, isHovered] = useHover();
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
        toggleHighlighted();
        onHover(e, isHighlighted ? { coordinates: null } : item);
    };

    const onMouseOverHandler = (event) => {
        if (isMobile) return;
        onHover(event, item);
    };

    const onMouseOutHandler = (event) => {
        if (isMobile) return;
        onHover(event, { coordinates: null });
    };

    return (
        <div
            ref={hoverRef}
            className="Item Element"
            style={rootItemStyle}
            onClick={mobileOnClick}
            onMouseOver={onMouseOverHandler}
            onMouseOut={onMouseOutHandler}
        >
            <img
                alt="Item Logo"
                className={`image ${showDetails ? 'image-hovered' : ''}`}
                src={item.image}
            />
            <div className={`middle ${showDetails ? 'middle-hovered' : ''}`}>
                <div className="info">
                    <div>{item.title}</div>
                    <div className="date">{item.date}</div>
                </div>
                <IconButton
                    onClick={(event) => onClickHandler(event, item)}
                    sx={{
                        maxWidth: 'fit-content',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        color: 'inherit',
                    }}
                >
                    <BsInstagram className="icon" />
                </IconButton>
            </div>
        </div>
    );
}

function List({ prefix, events, onItemClick, onHover }) {
    const [highlightedId, setHighlightedId] = useState(null);

    const onClickHandler = (event, item) => {
        onItemClick(item);
        event.preventDefault();
        event.stopPropagation();
    };

    const listedEvents = events.some((e) => e.isSelected)
        ? events.filter((e) => e.isSelected)
        : events;
    const items = listedEvents.map((item) => (
        <ListItem
            key={`list-item-${item.id}`}
            isSelected={item.isSelected}
            item={item}
            onClick={(event, item) => onClickHandler(event, item)}
            onHover={onHover}
            isHighlighted={item.id === highlightedId}
            toggleHighlighted={(_) =>
                setHighlightedId(item.id === highlightedId ? null : item.id)
            }
        />
    ));

    let rows = [];
    const chunkSize = isMobile ? 2 : 4;
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
