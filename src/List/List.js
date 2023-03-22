import './List.css';

function List({ events, isActive }) {
    return (
        <div className={`List ${isActive ? '' : 'Hidden'}`}>
            {events.map((item, idx) => 
                <div className='Item Element' key={`list-item-${idx}`}>
                    <img alt="Item" style={{height: '100%', objectFit: 'contain'}} src={item.image} />
                    <div>
                        <p> {item.title} <b>{item.date}</b> </p>
                        <p/>
                        <p> {item.description} </p>
                        <p />
                        <p> { item.tags }</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default List;
