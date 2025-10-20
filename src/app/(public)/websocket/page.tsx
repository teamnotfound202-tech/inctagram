'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// WS endpoints and events
const WS_URL = 'https://inctagram.work';

enum WS_EVENT_PATH {
    RECEIVE_MESSAGE = 'receive-message',
    UPDATE_MESSAGE = 'update-message',
    MESSAGE_DELETED = 'message-deleted',
    MESSAGE_SEND = 'message-send',
    NOTIFICATIONS = 'notifications',
    ERROR = 'error',
}

// Types from your spec
type MessageSendRequest = {
    message: string;
    receiverId: number;
};

type MessageUpdateRequest = {
    id: number;
    message: string;
};

type MessageStatus = 'SENT' | 'RECEIVED' | 'READ';

type MessageType = {
    id: number;
    ownerId: number;
    receiverId: number;
    messageText: string;
    status: MessageStatus;
    messageType: string;
    createdAt: string;
    updatedAt: string;
};

type NotificationType = {
    id: number;
    clientId: string;
    message: string;
    isRead: boolean;
    notifyAt: string;
};

// Replace with your real token retrieval
const getAccessToken = () =>
    typeof window !== 'undefined'
        ? localStorage.getItem('auth-token') || ''
        : '';

export default function Page() {
    const [receiverId, setReceiverId] = useState<number>(2);
    const [message, setMessage] = useState<string>('');
    const [updateId, setUpdateId] = useState<number>(0);
    const [updateText, setUpdateText] = useState<string>('');
    const [logs, setLogs] = useState<string[]>([]);
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [connected, setConnected] = useState(false);

    const socketRef = useRef<Socket | null>(null);

    // single socket instance with query auth
    const socket = useMemo(() => {
        const token = getAccessToken();
        return io(WS_URL, {
            autoConnect: false,
            query: { accessToken: token },
            transports: ['websocket'], // вкладка Network -> WS будет нагляднее
        });
    }, []);

    useEffect(() => {
        socketRef.current = socket;

        socket.on('connect', () => {
            setConnected(true);
            pushLog(`✅ Connected: ${socket.id}`);
        });

        socket.on('disconnect', (reason) => {
            setConnected(false);
            pushLog(`❌ Disconnected: ${reason}`);
        });

        socket.on('connect_error', (err) => {
            pushLog(`🚫 connect_error: ${err.message}`);
        });

        // RECEIVE_MESSAGE: и отправитель, и получатель получают сообщения по этому событию согласно вашей спецификации (отправитель — подтверждение сохранения, также сюда придет обновлённый статус)
        socket.on(WS_EVENT_PATH.RECEIVE_MESSAGE, (data: MessageType) => {
            pushLog(`📥 RECEIVE_MESSAGE: ${safeJson(data)}`);
            setMessages((prev) => upsertMessage(prev, data));
        });

        // MESSAGE_SEND: по ТЗ получатель получает сообщение через MESSAGE_SENT (у вас в перечне также есть MESSAGE_SEND как "Event triggered when a message is sent to the recipient").
        // Поддержим оба варианта для совместимости:
        socket.on(WS_EVENT_PATH.MESSAGE_SEND, (data: MessageType, ack?: (payload: { message: MessageType; receiverId: number }) => void) => {
            pushLog(`📩 MESSAGE_SEND: ${safeJson(data)}`);
            setMessages((prev) => upsertMessage(prev, data));

            // получатель обязан подтвердить получение: callback({ message, receiverId })
            if (typeof ack === 'function') {
                const receiver = data.receiverId;
                ack({ message: data, receiverId: receiver });
                pushLog(`🔁 ACK sent for MESSAGE_SEND (receiverId=${receiver})`);
            }
        });

        // Для совместимости, если сервер шлет MESSAGE_SENT отдельным именем события — подпишемся
       /* socket.on('message-sent', (data: MessageType, ack?: (payload: { message: MessageType; receiverId: number }) => void) => {
            pushLog(`📩 MESSAGE_SENT: ${safeJson(data)}`);
            setMessages((prev) => upsertMessage(prev, data));
            if (typeof ack === 'function') {
                const receiver = data.receiverId;
                ack({ message: data, receiverId: receiver });
                pushLog(`🔁 ACK sent for MESSAGE_SENT (receiverId=${receiver})`);
            }
        });
*/
        // UPDATE_MESSAGE: обе стороны получают обновлённый объект через RECEIVE_MESSAGE (по ТЗ),
        // но иногда бэкенд также может присылать echo через update-message. Подпишемся, чтобы всё увидеть в логах.
        socket.on(WS_EVENT_PATH.UPDATE_MESSAGE, (data: MessageType) => {
            pushLog(`♻️ UPDATE_MESSAGE: ${safeJson(data)}`);
            setMessages((prev) => upsertMessage(prev, data));
        }); //TODO: эта подписка скорее всего не нужна

        socket.on(WS_EVENT_PATH.MESSAGE_DELETED, (deletedId: number) => {
            pushLog(`🗑 MESSAGE_DELETED: ${deletedId}`);
            setMessages((prev) => prev.filter((m) => m.id !== deletedId));
        });

        socket.on(WS_EVENT_PATH.NOTIFICATIONS, (notif: NotificationType) => {
            pushLog(`🔔 NOTIFICATIONS: ${safeJson(notif)}`);
            setNotifications((prev) => [notif, ...prev]);
        });

        socket.on(WS_EVENT_PATH.ERROR, (errObj: any) => {
            pushLog(`⚠️ ERROR: ${safeJson(errObj)}`);
        });

        // подключаемся после назначения всех обработчиков
        socket.connect();

        return () => {
            socket.disconnect();
            socket.off();
        };
    }, [socket]);

    function pushLog(line: string) {
        setLogs((prev) => [`${new Date().toISOString()} ${line}`, ...prev].slice(0, 200));
    }

    function safeJson(v: any) {
        try {
            return JSON.stringify(v);
        } catch {
            return String(v);
        }
    }

    function upsertMessage(prev: MessageType[], incoming: MessageType) {
        const idx = prev.findIndex((m) => m.id === incoming.id);
        if (idx === -1) return [incoming, ...prev];
        const copy = prev.slice();
        copy[idx] = incoming;
        return copy;
    }

    // Emit helpers

    const handleSend = () => {
        if (!message.trim()) return;
        const payload: MessageSendRequest = {
            message,
            receiverId,
        };

        // По вашему ТЗ отправитель использует RECEIVE_MESSAGE для отправки (сервер сохранит и вернет сохранённое сообщение отправителю через RECEIVE_MESSAGE)
        // При необходимости можно протестировать и альтернативный вариант через MESSAGE_SEND.
        socket.emit(WS_EVENT_PATH.RECEIVE_MESSAGE, payload, (ack?: any) => {
            pushLog(`➡️ emit RECEIVE_MESSAGE payload=${safeJson(payload)} ack=${safeJson(ack)}`);
        });

        setMessage('');
    };

    const handleSendViaMessageSend = () => {
        if (!message.trim()) return;
        const payload: MessageSendRequest = {
            message,
            receiverId,
        };

        socket.emit(WS_EVENT_PATH.MESSAGE_SEND, payload, (ack?: any) => {
            pushLog(`➡️ emit MESSAGE_SEND payload=${safeJson(payload)} ack=${safeJson(ack)}`);
        });

        setMessage('');
    };

    const handleUpdate = () => {
        if (!updateId || !updateText.trim()) return;
        const payload: MessageUpdateRequest = {
            id: updateId,
            message: updateText,
        };
        socket.emit(WS_EVENT_PATH.UPDATE_MESSAGE, payload, (ack?: any) => {
            pushLog(`✏️ emit UPDATE_MESSAGE payload=${safeJson(payload)} ack=${safeJson(ack)}`);
        });
        setUpdateText('');
    };

    return (
        <div style={{ padding: 16, fontFamily: 'system-ui, sans-serif' }}>
            <h2>WS Test Page</h2>
            <p>Status: {connected ? 'connected' : 'disconnected'}</p>

            <section style={{ marginBottom: 16 }}>
                <h3>Auth</h3>
                <p>
                    Токен берется из localStorage: key = accessToken. Установите его перед тестом:
                </p>
                <code>
                    localStorage.setItem('auth-token', '[ВАШ_JWT]');
                </code>
            </section>

            <section style={{ marginBottom: 16 }}>
                <h3>Send message</h3>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <label>
                        receiverId:
                        <input
                            type="number"
                            value={receiverId}
                            onChange={(e) => setReceiverId(Number(e.target.value))}
                            style={{ marginLeft: 8, width: 120 }}
                        />
                    </label>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="message text"
                        style={{ flex: 1, minWidth: 240 }}
                    />
                    <button onClick={handleSend}>emit RECEIVE_MESSAGE</button>
                    <button onClick={handleSendViaMessageSend}>emit MESSAGE_SEND</button>
                </div>
            </section>

            <section style={{ marginBottom: 16 }}>
                <h3>Update message</h3>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <label>
                        id:
                        <input
                            type="number"
                            value={updateId}
                            onChange={(e) => setUpdateId(Number(e.target.value))}
                            style={{ marginLeft: 8, width: 120 }}
                        />
                    </label>
                    <input
                        type="text"
                        value={updateText}
                        onChange={(e) => setUpdateText(e.target.value)}
                        placeholder="new text"
                        style={{ flex: 1, minWidth: 240 }}
                    />
                    <button onClick={handleUpdate}>emit UPDATE_MESSAGE</button>
                </div>
            </section>

            <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                    <h3>Messages</h3>
                    <ul>
                        {messages.map((m) => (
                            <li key={m.id}>
                                #{m.id} [{m.status}] {m.ownerId}→{m.receiverId}: {m.messageText}{' '}
                                <small>{new Date(m.updatedAt || m.createdAt).toLocaleString()}</small>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3>Notifications</h3>
                    <ul>
                        {notifications.map((n) => (
                            <li key={n.id}>
                                {n.message} <small>at {new Date(n.notifyAt).toLocaleString()}</small>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section>
                <h3>Logs</h3>
                <pre
                    style={{
                        background: '#111',
                        color: '#0f0',
                        padding: 12,
                        borderRadius: 8,
                        maxHeight: 260,
                        overflow: 'auto',
                    }}
                >
          {logs.join('\n')}
        </pre>
            </section>
        </div>
    );
}
