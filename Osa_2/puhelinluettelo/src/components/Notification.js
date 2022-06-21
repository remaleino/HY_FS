const Notification = ({ message, status }) => {
    if (message === null) {
        return null
    }
    return (
        <div className="notification" style={status}>
            {message}
        </div>
    )
}
export default Notification