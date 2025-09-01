'use client'

import {Button} from "@/shared/ui/Button/Button";
import {CustomCheckbox} from '@/shared/ui/Checkbox/Checkbox';
import {SimpleDatePicker} from "@/shared/ui/DatePicker/SimpleDatePicker/SimpleDatePicker";
import {CalendarOutline} from "@/shared/ui/DatePicker/icons/CalendarOutline";
import {RadioButtons} from '@/shared/ui/RadioButtons/RadioButtons';
import {Sidebar} from '@/widgets/Sidebar/Sidebar';
import {Card} from "@/shared/ui/Cards/Cards";
import {ArrowRightIcon} from '@radix-ui/react-icons';
import {useState} from 'react'
import {TextArea} from "@/shared/ui/TextArea/TextArea";
import {TestCustomTabs} from "@/shared/ui/Tab/TestCustomTabs";
import SelectBox from "@/shared/ui/Select/Select";

export default function Home() {

  const [isChecked, setIsChecked] = useState(false)

  return (
    <div>
      <main style={{padding: '20px', maxWidth: '800px', margin: '0 auto'}}>
          <div>
              <Button>Button</Button>
              <Button  variant={'secondary'}>Button</Button>
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
              <CustomCheckbox text={'my checkbox'} id={'ca1'}/>
              <CustomCheckbox id={'ca2'} />
              <CustomCheckbox id={'ca3'} disabled={true} checked={true}/>
              <CustomCheckbox id={'ca4'} disabled={true} checked={false} text={'custom check'}/>
<SimpleDatePicker />
              <CalendarOutline/>
          </div>

          <div>
              <TextArea title={'my text'} placeholder={'my text'}/>
              <TextArea title={'my text'} error={'error'} placeholder={'my text'}/>
              <TextArea title={'my text'} disabled={true} placeholder={'my text'}/>
          </div>

          <TestCustomTabs/>
        <div>
              <Sidebar/>
          </div>
          <div>
              <RadioButtons/>
          </div>

          <Card style={{
              maxWidth:'300px'
          }}>sdfhksdffksfjdf</Card>
        
         {/* Селекты*/}
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    {/* Простой селект с defaultValue */}
                    <SelectBox
                        options={[{value: 'option1', label: 'Select Box 1'},
                            {value: 'option2', label: 'Select Box 2'},
                            {value: 'option3', label: 'Select Box 3'}]}
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
                        required
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
      </main>
    </div>
  );
}
