import { io } from 'socket.io-client'


export const createSocket = () => {
  const url = 'https://inctagram.work'
  const accessToken = typeof window !== 'undefined' ?
    localStorage.getItem('auth-token')
    : null

  const queryParams = {
    query: {
      accessToken: accessToken
    },
    transports: ["websocket"],
  };

  const socket =  io(url, queryParams);

  socket.on('connect',()=>{console.log('Подключились!!!')})
  socket.on('connect_error',()=>{console.log('Ошибка((!!!')})
  socket.on('disconnect',()=>{console.log('Ошибка((!!!')})

return socket
}