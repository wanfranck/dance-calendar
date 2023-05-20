export default function Tag({ value, onClick }) {
    const style = { 
        margin: '3px', 
        cursor: 'pointer', 
        display: 'block', 
        overflow: 'auto', 
        width: 'fit-content', 
    };

    const tagStyle = {
        width: 'fit-content',
        fontSize: '10px',
        fontWeight: 'bold',
        border: '1px solid black',
        borderRadius: '3px',
        padding: '3px'
    };

    function onClickHandler(event) {
        onClick(value);
        event.preventDefault();
    }
    return (
        <div style={style} onClick={onClickHandler}>
            <div style={tagStyle}>
                { value }
            </div>
        </div>
    );
}