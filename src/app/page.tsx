import {Button} from "@/shared/ui/Button/Button";
import {CustomCheckbox} from '@/shared/ui/Checkbox/Checkbox';
import {ArrowRightIcon} from '@radix-ui/react-icons';
import {SimpleDatePicker} from "@/shared/ui/DatePicker/SimpleDatePicker/SimpleDatePicker";
import {CalendarOutline} from "@/shared/ui/DatePicker/icons/CalendarOutline";


export default function Home() {
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
              <CustomCheckbox text={'my checkbox'} id={'ca1'}/>
              <CustomCheckbox id={'ca2'} />
              <CustomCheckbox id={'ca3'} disabled={true} checked={true}/>
              <CustomCheckbox id={'ca4'} disabled={true} checked={false} text={'custom check'}/>
<SimpleDatePicker />
              <CalendarOutline/>
          </div>
      </main>
    </div>
  );
}
