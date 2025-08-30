'use client';
import {Button} from "@/shared/ui/Button/Button";
import {CustomCheckbox} from '@/shared/ui/Checkbox/Checkbox';
import {RadioButtons} from '@/shared/ui/RadioButtons/RadioButtons';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import {useState} from 'react'
import {Sidebar} from '@/widgets/Sidebar/Sidebar';
import {Card} from "@/shared/ui/Cards/Cards";

export default function Home() {
    const [isChecked, setIsChecked] = useState(false)
  return (
    <div>
      <main>
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
              <CustomCheckbox text={'my checkbox'} id={'ca1'} checked={isChecked} onChangeAction={setIsChecked}/>
              <CustomCheckbox id={'ca2'} />
              <CustomCheckbox id={'ca3'} disabled={true} checked={true} />
              <CustomCheckbox id={'ca4'} disabled={true} checked={false} text={'custom check'}/>
          </div>
          <div>
              <Sidebar/>
          </div>
          <div>
              <RadioButtons/>
          </div>
          <Card style={{
              maxWidth:'300px'
          }}>sdfhksdffksfjdf</Card>
      </main>
    </div>
  );
}
