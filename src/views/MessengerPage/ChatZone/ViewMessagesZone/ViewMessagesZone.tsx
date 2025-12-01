import s from "./ViewMessagesZone.module.scss";
import {NotMyMessage} from "@/views/MessengerPage/ChatZone/message/NotMyMessage/NotMyMessage";
import {MyMessage} from "@/views/MessengerPage/ChatZone/message/MyMessage/MyMessage";

const testMessages = [
    {
        "id": 445,
        "ownerId": 5,
        "receiverId": 77,
        "messageText": "1111111111",
        "createdAt": "2025-10-21T07:13:26.075Z",
        "updatedAt": "2025-10-21T07:13:26.075Z",
        "messageType": "TEXT",
        "status": "SENT"
    },
    {
        "id": 444,
        "ownerId": 77,
        "receiverId": 5,
        "messageText": "И русский язык работает?",
        "createdAt": "2025-10-21T07:13:17.075Z",
        "updatedAt": "2025-10-21T07:13:17.075Z",
        "messageType": "TEXT",
        "status": "SENT"
    },
    {
        "id": 443,
        "ownerId": 5,
        "receiverId": 77,
        "messageText": "sdfsdfsdf",
        "createdAt": "2025-10-21T07:11:41.030Z",
        "updatedAt": "2025-10-21T07:11:41.030Z",
        "messageType": "TEXT",
        "status": "SENT"
    },
    {
        "id": 442,
        "ownerId": 77,
        "receiverId": 5,
        "messageText": "Hello",
        "createdAt": "2025-10-21T07:11:04.778Z",
        "updatedAt": "2025-10-21T07:11:04.778Z",
        "messageType": "TEXT",
        "status": "SENT"
    },
    {
        "id": 414,
        "ownerId": 5,
        "receiverId": 77,
        "messageText": "Updated Hello",
        "createdAt": "2025-10-20T14:18:34.657Z",
        "updatedAt": "2025-10-20T14:19:20.376Z",
        "messageType": "TEXT",
        "status": "SENT"
    },
    {
        "id": 410,
        "ownerId": 5,
        "receiverId": 77,
        "messageText": "123123",
        "createdAt": "2025-10-20T14:12:35.416Z",
        "updatedAt": "2025-10-20T14:12:35.416Z",
        "messageType": "TEXT",
        "status": "SENT"
    },
    {
        "id": 411,
        "ownerId": 5,
        "receiverId": 77,
        "messageText": "123123123123123123123123123123123123123123123123123123123123123123",
        "createdAt": "2025-10-20T14:12:35.416Z",
        "updatedAt": "2025-10-20T14:12:35.416Z",
        "messageType": "TEXT",
        "status": "SENT"
    }
]

export const ViewMessagesZone = () => {

    const renderedMessages = testMessages.map((message) => (
        message.ownerId === 5 ?                 //TODO: 5 - это моя Id, заменить на profile.id
            <MyMessage key={message.id}
                       text={message.messageText}
                       dateTime={message.createdAt}
                       isRead={message.status === "SENT"} //TODO: добавить enum
            /> :
            <NotMyMessage key={message.id}
                          text={message.messageText}
                          dateTime={message.createdAt}
            />

    ))

    return (
        <div className={s.viewMessagesZone}>
            {renderedMessages}
        </div>
    );
};