import React from 'react'
import {Pagination} from '@mui/material'
import s from './SuperPagination.module.scss'
import CustomSelect from "@/shared/ui/Pagination/CustomSelect/CustomSelect";

export type SuperPaginationPropsType = {
    id?: string
    page: number
    itemsCount: number
    totalCount: number
    onChange: (page: number, count: number) => void
}

const SuperPagination: React.FC<SuperPaginationPropsType> = (
    {
        page, itemsCount, totalCount, onChange, id = 'hw15',
    }
) => {

    const lastPage = Math.trunc(totalCount / itemsCount) +  //берем целое от деления
        ((totalCount % itemsCount > 0) ? 1 : 0)                     // если есть остаток, то добавляем еще одну страницу

    const onChangeCallback = (event: any, page: number) => {
        onChange(page, itemsCount)
    }

    const onChangeSelect = (value: any) => {
        onChange(page, value)
    }

    return (
        <div className={s.pagination}>
            <Pagination
                id={id + '-pagination'}
                variant="outlined"
                shape="rounded"
                siblingCount={1}
                boundaryCount={1}
                page={page}
                count={lastPage}
                onChange={onChangeCallback}
            />

            <span className={s.text1}>
                Show
            </span>

            <CustomSelect value={itemsCount}
                          options={[
                              {value: 10, label: '10'},
                              {value: 20, label: '20'},
                              {value: 30, label: '30'},
                              {value: 50, label: '50'},
                              {value: 100, label: '100'},
                          ]}
                          onChange={onChangeSelect}/>

            <span className={s.text2}>
                on page
            </span>
        </div>
    )
}
export default SuperPagination
