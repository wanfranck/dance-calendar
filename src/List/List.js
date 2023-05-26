import './List.css';

import { BsInstagram } from 'react-icons/bs';

function ListItem({ item, isSelected, onClick }) {
    const rootItemStyle = {
        display: 'inline-block',
        flexDirection: 'column',
        borderRadius: '4px',
        border: 'solid',
        borderWidth: isSelected ? '2px' : '1px',
        borderColor: isSelected ? '#E8AA42' : '#d3d4d5',
        backgroundColor: isSelected ? '#d3d4d5' : 'white',
    };

    return (
        <div className="Item Element" style={rootItemStyle}>
            <img alt="Item Logo" className="image" src={item.image} />
            <div className="middle">
                <div style={{ fontSize: '20px', fontWeight: '500' }}>
                    <div>{item.title}</div>
                    <div style={{ fontWeight: '600' }}>{item.date}</div>
                </div>
                <div>
                    <BsInstagram
                        style={{
                            width: '35px',
                            height: '35px',
                            cursor: 'pointer',
                        }}
                        onClick={(event) => onClick(event, item)}
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
        .map((item, idx) => (
            <ListItem
                key={`list-item-${idx}`}
                isSelected={item.isSelected}
                item={item}
                onClick={(event, item) => onClickHandler(event, item)}
            />
        ))
        .concat(
            groupedEvents.rest.map((item, idx) => (
                <ListItem
                    key={`list-item-${idx}`}
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
        rows.push(<div className="Row">{chunk}</div>);
    }

    return (
        <div key={`list-${prefix}`} className={`List`}>
            {rows}
        </div>
    );
}

export default List;
