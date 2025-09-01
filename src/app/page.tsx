'use client';
import {Button} from "@/shared/ui/Button/Button";
import {CustomCheckbox} from '@/shared/ui/Checkbox/Checkbox';
import {ArrowRightIcon} from '@radix-ui/react-icons';
import {useCallback, useState} from 'react'
import {Sidebar} from '@/widgets/Sidebar/Sidebar';
import SuperPagination from "@/shared/ui/Pagination/SuperPagination";


export default function Home() {
    const [isChecked, setIsChecked] = useState(false)
    const [page, setPage] = useState(1)         //моковые страницы, после теста - удалить
    const [itemsCount, setItemsCount] = useState(10)         //моковые страницы, после теста - удалить

    const superPaginationChangeHandler = useCallback((page: number, itemsCount: number) => {
        setPage(page)
        setItemsCount(itemsCount)
    }, [])                                                  //моковый коллбэк, после теста - удалить

    return (
        <div>
            <main>
                <div>
                    <Button>Button</Button>
                    <Button variant={'secondary'}>Button</Button>
                    <Button variant={'outline'}>Button</Button>
                    <Button variant={'text'}>Button</Button>
                    <Button asChild variant={'text'}>
                        <a href="/signup">
                            Зарегистрироваться
                            <ArrowRightIcon/>
                        </a>
                    </Button>
                </div>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <CustomCheckbox text={'my checkbox'} id={'ca1'} checked={isChecked} onChangeAction={setIsChecked}/>
                    <CustomCheckbox id={'ca2'}/>
                    <CustomCheckbox id={'ca3'} disabled={true} checked={true}/>
                    <CustomCheckbox id={'ca4'} disabled={true} checked={false} text={'custom check'}/>
                </div>
                <div>
                    <SuperPagination page={page} onChange={superPaginationChangeHandler} totalCount={220} itemsCount={itemsCount}/>
                </div>
                <div>
                    <Sidebar/>
                </div>

            </main>
        </div>
    );
}
