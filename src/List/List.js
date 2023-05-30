import './List.css';

import { BsInstagram } from 'react-icons/bs';

import { useHover } from '../Utils/ReactUtils';
import { useState } from 'react';
import { isMobile } from 'react-device-detect';
import IconButton from '@mui/material/IconButton';

function ListItem({ item, isSelected, onClick, onHover }) {
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
        onHover(e, item);
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
        .concat(groupedEvents.rest)
        .map((item) => (
            <ListItem
                key={`list-item-${item.id}`}
                isSelected={item.isSelected}
                item={item}
                onClick={(event, item) => onClickHandler(event, item)}
                onHover={onHover}
            />
        ));
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
