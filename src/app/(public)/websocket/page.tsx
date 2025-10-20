'use client'
import io from 'socket.io-client';
import {useState, useEffect} from "react";

const RECEIVE_MESSAGE = 'receive-message'// Event for sending and receiving messages.
const UPDATE_MESSAGE = 'update-message'// Event for updating an existing message.
const MESSAGE_DELETED = 'message-deleted'//Event triggered when a message is deleted.
const MESSAGE_SEND = 'message-send'// Event triggered when a message is sent to the recipient.
const NOTIFICATIONS = 'notifications'// Event for receiving real-time notifications.
const ERROR = 'error'// Event for handling errors.

// URL вашего сервера
const URL = 'https://inctagram.work';
const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc2MDk2MDc5OSwiZXhwIjoxNzYwOTY0Mzk5fQ.3Gsn53hSuUJtSYqyHdgyyG-cq5KjieWFVIKOHdwHNTs"; // Лучше получать токен динамически, например, из localStorage или cookie

const socket = io(URL, {
    // Отключаем авто-подключение, чтобы иметь контроль над моментом установки соединения
    autoConnect: true,
    query: {
        accessToken: accessToken
    }
});

type MessageSendRequest = {
    "message": "string",
    "receiverId": "number"
}

const Page = () => {
    const [message, setMessage] = useState('');
    const [receivedMessages, setReceivedMessages] = useState([]);

    useEffect(() => {

        socket.on(ERROR, (err) => {
            console.error('🚫 Ошибка соединения:', err.message);
            // err.data содержит дополнительные детали
        });

        // Слушаем нотификации от сервера
        socket.on(NOTIFICATIONS, (notification) => {
            console.log('NOTIFICATIONS ', notification)
        });

        // Слушаем сообщения от сервера
        socket.on(RECEIVE_MESSAGE, (msg) => {
            setReceivedMessages((prevMessages) => [...prevMessages, msg]);
            console.log('msg ', msg)
        });

        // Отписываемся от события при размонтировании компонента
        return () => {
            socket.off(RECEIVE_MESSAGE);
        };
    }, []);

    const sendMessage = () => {

        if (message) {
            const newMessageConstruction: MessageSendRequest = {
                message,
                receiverId: 5
            }
            socket.emit(MESSAGE_SEND, newMessageConstruction);
            console.log('message sent', newMessageConstruction)
            setMessage('');
        }
    };

    return (
        <div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Введите сообщение..."
            />
            <button onClick={sendMessage}>Отправить</button>
            <ul>
                {receivedMessages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
};

export default Page;