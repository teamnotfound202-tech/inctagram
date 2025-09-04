'use client'

import {Button} from "@/shared/ui/Button/Button";
import {CustomCheckbox} from '@/shared/ui/Checkbox/Checkbox';
import {SimpleDatePicker} from "@/shared/ui/DatePicker/SimpleDatePicker/SimpleDatePicker";
import {CalendarOutline} from "@/shared/ui/DatePicker/icons/CalendarOutline";
import {RadioButtons} from '@/shared/ui/RadioButtons/RadioButtons';
import {ArrowRightIcon} from '@radix-ui/react-icons';
import {useCallback, useState} from 'react'
import {TextArea} from "@/shared/ui/TextArea/TextArea";
import {TestCustomTabs} from "@/shared/ui/Tab/TestCustomTabs";
import ToolTip from "@/shared/ui/tooltip/Tooltip";
import {Sidebar} from '@/widgets/Sidebar/Sidebar';
import {Card} from "@/shared/ui/Cards/Cards";
import {AlertsProvider, AlertToast} from "@/shared/ui/Alerts/Alerts";
import {ScrollBox} from "@/shared/ui/Scroll/Scroll";
import SuperPagination from "@/shared/ui/Pagination/SuperPagination";
import {Header} from "@/widgets/Header/Header";
import {SelectBox} from "@/shared/ui/Select/Select";
import FlagRussia from "@/shared/ui/Select/icon/FlagRussia.svg"
import FlagEngland from "@/shared/ui/Select/icon/FlagEngland.svg"
import {RangeDatePicker} from "@/shared/ui/DatePicker/RangeDatePicker/RangeDatePicker";

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
            <FlagRussia/>
            <main style={{padding: '20px', maxWidth: '1280px', margin: '0 auto'}}>
                <div style={{marginBottom: '30px'}}>
                    <Header isLogin={true} notification={11}/>
                </div>
                <div style={{marginBottom: '30px'}}>
                    <Header isLogin={false} notification={11}/>
                </div>

                <div style={{marginBottom: '30px', border: '1px solid white', padding: '10px'}}>
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
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginBottom: '30px',
                    border: '1px solid white',
                    padding: '10px'
                }}>
                    <CustomCheckbox text={'my checkbox'} id={'ca1'}/>
                    <CustomCheckbox id={'ca2'}/>
                    <CustomCheckbox id={'ca3'} disabled={true} checked={true}/>
                    <CustomCheckbox id={'ca4'} disabled={true} checked={false} text={'custom check'}/>
                    <SimpleDatePicker/>
                    <RangeDatePicker/>

                </div>

                <div style={{marginBottom: '30px', border: '1px solid white', padding: '10px'}}>
                    <TextArea title={'my text'} placeholder={'my text'}/>
                    <TextArea title={'my text'} error={'error'} placeholder={'my text'}/>
                    <TextArea title={'my text'} disabled={true} placeholder={'my text'}/>
                </div>
                <div>
                    <AlertsProvider position="top-right">
                        {/* Покажем две нотификации сразу в открытом состоянии */}
                        <AlertToast
                            variant="error"
                            title="Error!"
                            description="Server is not available"
                        />
                        <AlertToast
                            variant="success"
                            description="Your settings are saved"
                        />
                    </AlertsProvider>
                </div>
                <div style={{marginBottom: '30px', border: '1px solid white', padding: '10px'}}>
                    {/* Табы*/}
                    <TestCustomTabs/>
                </div>

                {/* Пагинация*/}
                <div style={{marginBottom: '30px', border: '1px solid white', padding: '10px'}}>
                    <SuperPagination page={page} onChange={superPaginationChangeHandler} totalCount={220}
                                     itemsCount={itemsCount}/>
                </div>
                <div style={{marginBottom: '30px', border: '1px solid white'}}>
                    <Sidebar/>
                </div>
                <div style={{marginBottom: '30px', border: '1px solid white'}}>
                    <RadioButtons/>
                </div>
                <div style={{marginBottom: '30px', border: '1px solid white', padding: '10px'}}>
                    <ToolTip
                        title={'Активное и неактивное состояние таба показано в колонке Default. Колонки Active, Hover, Focus и Disabled отображают поведение элемента при наличии соответствующего'}>
                        <button style={{
                            backgroundColor: 'red',
                            color: 'white',
                        }}>Hover me
                        </button>
                    </ToolTip>
                </div>

                <div style={{marginBottom: '30px', border: '1px solid white', padding: '10px'}}>
                    <Card style={{
                        maxWidth: '300px'
                    }}>sdfhksdffksfjdf</Card>
                </div>
                <div style={{marginBottom: '30px', border: '1px solid white', padding: '10px'}}>
                    <div style={{padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24}}>
                        {/*Вертикальный скролл */}
                        <div style={{height: 180, padding: 8, width: 400}}>
                            <ScrollBox orientation="vertical">
                                <div>What is Lorem Ipsum?
                                    1914 translation by H. Rackham
                                    "But I must explain to you how all this mistaken idea of denouncing pleasure and
                                    praising pain was born and I will give you a complete account of the system, and
                                    expound the actual teachings of the great explorer of the truth, the master-builder
                                    of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it
                                    is pleasure, but because those who do not know how to pursue pleasure rationally
                                    encounter consequences that are extremely painful. Nor again is there anyone who
                                    loves or pursues or desires to obtain pain of itself, because it is pain, but
                                    because occasionally circumstances occur in which toil and pain can procure him some
                                    great pleasure. To take a trivial example, which of us ever undertakes laborious
                                    physical exercise, except to obtain some advantage from it? But who has any right to
                                    find fault with a man who chooses to enjoy a pleasure that has no annoying
                                    consequences, or one who avoids a pain that produces no resultant pleasure?" Lorem
                                    Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                                    been the industry's standard dummy text ever since the 1500s, when an unknown
                                    printer took a galley of type and scrambled it to make a type specimen book. It has
                                    survived not only five centuries, but also the leap into electronic typesetting,
                                    remaining essentially unchanged. It was popularised in the 1960s with the release of
                                    Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                                    publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                </div>
                            </ScrollBox>
                        </div>

                        {/* Горизонтальный и вертикальный скролл */}
                        <div style={{height: 120, width: 400, padding: 8}}>
                            <ScrollBox orientation='both'>
                                <div style={{width: 600}}>
                                    1914 translation by H. Rackham
                                    "But I must explain to you how all this mistaken idea of denouncing pleasure and
                                    praising pain was born and I will give you a complete account of the system, and
                                    expound the actual teachings of the great explorer of the truth, the master-builder
                                    of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it
                                    is pleasure, but because those who do not know how to pursue pleasure rationally
                                    encounter consequences that are extremely painful. Nor again is there anyone who
                                    loves or pursues or desires to obtain pain of itself, because it is pain, but
                                    because occasionally circumstances occur in which toil and pain can procure him some
                                    great pleasure. To take a trivial example, which of us ever undertakes laborious
                                    physical exercise, except to obtain some advantage from it? But who has any right to
                                    find fault with a man who chooses to enjoy a pleasure that has no annoying
                                    consequences, or one who avoids a pain that produces no resultant pleasure?"

                                </div>
                            </ScrollBox>
                        </div>
                        {/* Горизонтальный скролл */}
                        <div style={{height: 120, width: 400, padding: 8}}>
                            <ScrollBox orientation='horizontal'>
                                <div style={{width: 600, height: 80}}>
                                    1914 translation by H. Rackham
                                    "But I must explain to you how all this mistaken idea of denouncing pleasure and
                                    praising pain was born and I will give you a complete account of the system, and
                                    expound the actual teachings of the great explorer of the truth, the master-builder
                                    of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it
                                    is pleasure, but because those who do not know how to pursue pleasure rationally
                                    encounter consequences that are extremely painful. Nor again is there anyone who
                                    loves or pursues or desires to obtain pain of itself, because it is pain, but
                                    because occasionally circumstances occur in which toil and pain can procure him some
                                    great pleasure. To take a trivial example, which of us ever undertakes laborious
                                    physical exercise, except to obtain some advantage from it? But who has any right to
                                    find fault with a man who chooses to enjoy a pleasure that has no annoying
                                    consequences, or one who avoids a pain that produces no resultant pleasure?"

                                </div>
                            </ScrollBox>
                        </div>
                    </div>
                </div>


                {/* Селекты*/}

                <div>
                    <div style={{
                        border: '1px solid white',
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px'
                    }}>
                        {/* Простой селект с defaultValue */}
                        <SelectBox
                            options={[{value: 'option1', icon:<FlagRussia/>,label: 'Select Box 1'},
                                {value: 'option2', label: 'Select Box 2', icon:<FlagEngland/>}]}
                            defaultValue="option1"
                            onValueChange={(value) => console.log('Simple selected:', value)}
                            placeholder="Select Box"
                            label="Простой селект"
                        />

                        {/* Обязательный селект */}
                        <SelectBox
                            options={[{value: 'option1', label: 'Select Box 1'},
                                {value: 'option2', label: 'Select Box 2'},
                                {value: 'option3', label: 'Select Box 3'}]}
                            onValueChange={(value) => console.log('Required selected:', value)}
                            placeholder="Выберите обязательную опцию"
                            label="Обязательный селект"
                            required={false}
                        />

                        {/* Отключенный селект */}
                        <SelectBox
                            options={[{value: 'option1', label: 'Select Box 1'},
                                {value: 'option2', label: 'Select Box 2'},
                                {value: 'option3', label: 'Select Box 3'}]}
                            defaultValue="option2"
                            placeholder="Выберите опцию"
                            label="Отключенный селект"
                            disabled
                        />
                    </div>
                </div>

            </main>
        </div>
    );
}


