export function isErrorWithMessage(errorObj: unknown): errorObj is {
  statusCode: number
  messages: Array<{ message: string; field: string }>
  error: string
} {
  return (
    typeof errorObj === 'object' && // Проверяем, что error – это объект
    errorObj !== null && // Убеждаемся, что это не null
    'statusCode' in errorObj &&
    typeof errorObj.statusCode === 'number' &&
    'messages' in errorObj && // Проверяем, что у объекта есть свойство 'messages'
    Array.isArray(errorObj.messages) &&
    errorObj.messages.length > 0 &&
    typeof errorObj.messages[0].message === 'string' &&
    typeof errorObj.messages[0].field === 'string'
  )
}
