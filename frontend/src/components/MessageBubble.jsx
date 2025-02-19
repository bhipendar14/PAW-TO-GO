

const MessageBubble = ({ message }) => {
    return (
        <div className={`message-bubble ${message.sender === "me" ? "sent" : "received"}`}>
            {message.text}
        </div>
    );
};

export default MessageBubble;