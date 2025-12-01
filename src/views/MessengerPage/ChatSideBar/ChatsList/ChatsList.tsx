import s from "./ChatsList.module.scss";
import {PersonChat} from "@/views/MessengerPage/ChatSideBar/ChatsList/PersonChat/PersonChat";

const testPersons = [
    {
        avatar: 'asd',
        name: 'asd',
        dateTime: '2021-06-07',
        message: 'message 1'
    },
    {
        avatar: '222',
        name: '222',
        dateTime: '2021-06-07',
        message: 'message 2'
    },
    {
        avatar: '333',
        name: '333',
        dateTime: '2021-06-07',
        message: 'message 3'
    },
    {
        avatar: '444',
        name: '444',
        dateTime: '2021-06-07',
        message: 'message 4'
    },
    {
        avatar: '555',
        name: '555',
        dateTime: '2021-06-07',
        message: 'message 5'
    },
    {
        avatar: '666',
        name: '666',
        dateTime: '2021-06-07',
        message: 'message 6'
    }
]

export const ChatsList = () => {

    const renderedChats = testPersons.map((person) => (
        <PersonChat key={person.avatar}
            avatar={person.avatar}
            name={person.name}
            dateTime={person.dateTime}
            message={person.message}
        />
    ))

    return (
        <div className={s.personsChatsList}>
            {renderedChats}
        </div>
    )
};