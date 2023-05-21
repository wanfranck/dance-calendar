import './Popup.css'

function Popup({ isShow, content, onClose }) {
    return (
        <div
            className={`Popup ${isShow ? 'PopupOpened' : ''}`}
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    onClose()
                }
            }}
        >
            {content}
        </div>
    )
}

export default Popup
