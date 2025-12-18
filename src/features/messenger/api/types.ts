import {ISOStringFormat} from "date-fns";
import {Avatar} from "@/features/publicUserApi/types";

export enum MessageType {
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    VOICE = 'VOICE'
}

export enum MessageStatus {
    SENT = 'SENT',
    RECEIVED = 'RECEIVED',
    READ = 'READ '
}

export type MessageViewModal = {
    id: number;
    ownerId: number;
    receiverId: number;
    messageText: string;
    createdAt: ISOStringFormat;
    updatedAt: ISOStringFormat;
    messageType: MessageType;
    status: MessageStatus;
}

export type LastMessageViewDTO = MessageViewModal & {
    userName: string
    avatars: Avatar[]
    notReadCount: number
}

export type MessagesResponse<T> = {
    pageSize: number;
    totalCount: number;
    notReadCount?: number;
    items: T[];
}

export type MessagesRequest = {
    cursor?: number;
    pageSize?: number;
    searchName?: string;
}

export type MessagesFromPartnerRequest =
    MessagesRequest & {
    dialoguePartnerId: number;
}

export type MessagesFromPartnerResponse = MessagesResponse<MessageViewModal>
export type LastMessagesResponse = MessagesResponse<LastMessageViewDTO>

export type MessageSendRequest = {
    message: string,
    receiverId: number
}

export type MessageUpdateRequest = {
    id: number,
    message: string
}