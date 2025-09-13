import React, { type ChangeEvent } from 'react'
import { Pagination } from '@mui/material'
import s from './SuperPagination.module.scss'
import CustomSelect from '@/shared/ui/Pagination/CustomSelect/CustomSelect'

export type SuperPaginationPropsType = {
  id?: string
  page: number
  itemsCount: number
  totalCount: number
  onChange: (page: number, count: number) => void
}

export const SuperPagination: React.FC<SuperPaginationPropsType> = ({
  page,
  itemsCount,
  totalCount,
  onChange,
}) => {
  const findLastPage = (totalCount: number, itemsCount: number) => {
    return (
      Math.trunc(totalCount / itemsCount) + //берем целое от деления
      (totalCount % itemsCount > 0 ? 1 : 0)
    ) // если есть остаток, то добавляем еще одну страницу
  }

  const lastPage = findLastPage(totalCount, itemsCount)

  const onChangeCallback = (event: ChangeEvent<unknown>, page: number) => {
    onChange(page, itemsCount)
  }

  const onChangeSelect = (value: string | number) => {
    const numericValue = typeof value === 'string' ? parseInt(value, 10) : value
    const pagePosition = page <= findLastPage(totalCount, numericValue) ? page : 1 //Если количество странц больше, чем нужно
    //установить указатель на 1 страницу
    onChange(pagePosition, numericValue)
  }

  return (
    <div className={s.pagination}>
      <Pagination
        variant="outlined"
        shape="rounded"
        siblingCount={1}
        boundaryCount={1}
        page={page}
        count={lastPage}
        onChange={onChangeCallback}
      />

      <span className={s.text1}>Show</span>

      <CustomSelect
        value={itemsCount}
        options={[
          { value: 10, label: '10' },
          { value: 20, label: '20' },
          { value: 30, label: '30' },
          { value: 50, label: '50' },
          { value: 100, label: '100' },
        ]}
        onChange={onChangeSelect}
      />

      <span className={s.text2}>on page</span>
    </div>
  )
}
