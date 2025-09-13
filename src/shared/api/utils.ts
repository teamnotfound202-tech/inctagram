import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

/**
 * Универсальная утилита для типизации ошибок RTK Query.
 *
 * @template T Тип данных, ожидаемый в поле `data` ошибки.
 * @param error Любая ошибка, которую нужно проверить.
 * @returns Объект с полями `status` и `data`, если ошибка является FetchBaseQueryError и содержит данные типа `T`, иначе `null`.
 *
 * @example
 * const typedError = getTypedErrorData<MyErrorType>(error);
 * if (typedError?.data) {
 *   console.log(typedError.data.message);
 * }
 */
export function getTypedErrorData<T>(
  error: unknown
): { status?: number | string; data?: T } | null {
  if (typeof error === 'object' && error !== null && 'status' in error && 'data' in error) {
    const err = error as FetchBaseQueryError & { data: T }
    return {
      status: err.status,
      data: err.data,
    }
  }
  return null
}
