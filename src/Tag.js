export default function Tag({ value, isActive, onClick }) {
    const style = {
        display: 'inline-block',
        cursor: 'pointer',
        margin: '3px',
        width: 'fit-content',
    };

    const tagStyle = {
        width: 'fit-content',
        fontSize: '10px',
        fontWeight: 'bold',
        border: '1px solid #d3d4d5',
        borderRadius: '3px',
        padding: '3px',
        backgroundColor: isActive ? '#E8AA42' : '#025464',
        color: 'white',
    };

    function onClickHandler(event) {
        onClick(value);
        event.preventDefault();
    }
    return (
        <div style={style} onClick={onClickHandler}>
            <div style={tagStyle}>{value}</div>
        </div>
    );
}
