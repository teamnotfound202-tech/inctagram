import React from 'react'
import SuperSelect from './SuperSelect/SuperSelect'
import {Pagination} from '@mui/material'
import s from './SuperPagination.module.scss'
import CustomSelect from "@/shared/ui/Pagination/CustomSelect/CustomSelect";

export type SuperPaginationPropsType = {
    id?: string
    page: number
    itemsCountForPage: number
    totalCount: number
    onChange: (page: number, count: number) => void
}

const SuperPagination: React.FC<SuperPaginationPropsType> = (
    {
        page, itemsCountForPage, totalCount, onChange, id = 'hw15',
    }
) => {
    // const lastPage = Math.trunc(totalCount / itemsCountForPage) + //берем целое от деления
    //     ((totalCount % itemsCountForPage > 0) ? 1 : 0) // если есть остаток, то добавляем еще одну страницу  // пишет студент // вычислить количество страниц

    const onChangeCallback = (event: any, page: number) => {
         onChange(page, itemsCountForPage)
    }

    const onChangeSelect = (event: any) => {
        onChange(page, +event.target.value)
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
                count={totalCount}
                onChange={onChangeCallback}
            />

            <span className={s.text1}>
                Show
            </span>

            {/*<SuperSelect
                id={id + '-pagination-select'}
                value={itemsCountForPage}
                options={[
                    {id: 10, value: 10},
                    {id: 20, value: 20},
                    {id: 30, value: 30},
                    {id: 50, value: 50},
                    {id: 100, value: 100},
                ]}
                onChange={onChangeSelect}
            />*/}

            <CustomSelect value={itemsCountForPage}
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
