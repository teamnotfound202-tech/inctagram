import s from "./ViewMessagesZone.module.scss";

import {NotMyMessage} from "@/features/messenger/ui/Messenger/ChatZone/message/NotMyMessage/NotMyMessage";
import {useFetchMessagesFromPartnerInfiniteQuery} from "@/features/messenger/api/messengerApi";
import {Loader} from "@/shared/ui/Loader/Loader";
import {MyMessage} from "@/features/messenger/ui/Messenger/ChatZone/message/MyMessage/MyMessage";
import {useMeQuery} from "@/features/auth/api/authApi";

type Props = {
    activeUserIdChat: number
}

export const ViewMessagesZone = ({activeUserIdChat}: Props) => {

    const {data, isLoading} = useFetchMessagesFromPartnerInfiniteQuery({dialoguePartnerId: activeUserIdChat})
    const {data: me} = useMeQuery()

    const messages = data?.pages.flatMap(page => page.items)

    if (isLoading) return <Loader/>

    const renderedMessages = messages?.map((message) => (
        message.ownerId === me?.userId ?

            <MyMessage key={message.id}
                       text={message.messageText}
                       createdAt={message.createdAt}
                       updatedAt={message.updatedAt}
                       status={message.status}
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