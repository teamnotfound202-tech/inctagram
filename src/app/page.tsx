'use client';
import {Button} from "@/shared/ui/Button/Button";
import {CustomCheckbox} from '@/shared/ui/Checkbox/Checkbox';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import {useState} from 'react'
import {AlertsProvider, AlertToast} from "@/shared/ui/Alerts/Alerts";


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


      </main>
    </div>
  );
}
