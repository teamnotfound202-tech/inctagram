import { io } from 'socket.io-client'

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectDelay = 2000;
  private lastReconnectTime = 0;
  private messageHandler: ((message: WebSocketMessage) => void) | null = null;

  connect(user: User, onMessage: (message: WebSocketMessage) => void) {
    try {
      if (this.socket && this.socket.connected) {
        console.warn('Socket.IO уже подключен');
        return;
      }

      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
      }

      this.messageHandler = onMessage;

      // Инициализация соединения
      this.socket = io('ws://your-server-url', {
        forceNew: true,
        transports: ['websocket']
      });

      this.setupEventListeners();
      this.resetReconnectState();

    } catch (error) {
      console.error('Ошибка подключения WebSocket:', error);
      this.handleReconnect(user);
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('WebSocket подключен');
      this.resetReconnectState();
    });

    this.socket.on('message', (data: WebSocketMessage) => {
      if (this.messageHandler) {
        this.messageHandler(data);
      }
    });

    this.socket.on('disconnect', (reason: string) => {
      console.log('WebSocket отключен:', reason);
      this.handleDisconnect();
    });

    this.socket.on('connect_error', (error: Error) => {
      console.error('Ошибка подключения WebSocket:', error);
      this.handleReconnect();
    });
  }

  private handleDisconnect() {
    // Проверяем, было ли это преднамеренное отключение
    if (this.reconnectAttempts === 0) {
      this.handleReconnect();
    }
  }

  private handleReconnect(user?: User) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Превышено максимальное количество попыток переподключения');
      return;
    }

    const currentTime = Date.now();
    if (currentTime - this.lastReconnectTime < this.reconnectDelay) {
      // Ждем перед следующей попыткой
      setTimeout(() => {
        this.handleReconnect(user);
      }, this.reconnectDelay);
      return;
    }

    this.reconnectAttempts++;
    this.lastReconnectTime = currentTime;

    console.log(`Попытка переподключения ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);

    if (user && this.messageHandler) {
      setTimeout(() => {
        this.connect(user, this.messageHandler!);
      }, this.reconnectDelay);
    }
  }

  private resetReconnectState() {
    this.reconnectAttempts = 0;
    this.lastReconnectTime = 0;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.resetReconnectState();
    this.messageHandler = null;
  }

  send(message: WebSocketMessage) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('message', message);
    } else {
      console.warn('WebSocket не подключен, невозможно отправить сообщение');
    }
  }

  isConnected(): boolean {
    return !!(this.socket && this.socket.connected);
  }
}

// Интерфейсы для типизации
interface User {
  id: string;
  name: string;
}

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: number;
}

// Декларация для Socket.IO клиента (обычно устанавливается через npm пакет)

interface Socket {
  connected: boolean;
  disconnect(): void;
  on(event: string, callback: (data: any) => void): void;
  emit(event: string, data: any): void;
}