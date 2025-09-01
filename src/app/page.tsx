'use client';
import {Button} from "@/shared/ui/Button/Button";
import {CustomCheckbox} from '@/shared/ui/Checkbox/Checkbox';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import {useState} from 'react'
import {AlertsProvider, AlertToast} from "@/shared/ui/Alerts/Alerts";
import {ScrollBox} from "@/shared/ui/Scroll/Scroll";



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

          <div style={{padding:24, display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:24 }}>
              {/*Вертикальный скролл */}
              <div style={{ height:180,  padding:8, width:400}}>
                  <ScrollBox orientation="vertical">
                              <div>
                                  What is Lorem Ipsum?
                                  1914 translation by H. Rackham
                                  "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"
                                  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

                              </div>
                  </ScrollBox>
              </div>

              {/* Горизонтальный и вертикальный скролл */}
              <div style={{ height:120, width:400, padding:8 }}>
                  <ScrollBox orientation='both'>
                      <div style={{ width:600}}>
                          1914 translation by H. Rackham
                          "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"

                      </div>
                  </ScrollBox>
              </div>
              {/* Горизонтальный скролл */}
              <div style={{ height:120, width:400, padding:8 }}>
                  <ScrollBox orientation='horizontal'>
                      <div style={{ width:600, height:80}}>
                          1914 translation by H. Rackham
                          "But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?"

                      </div>
                  </ScrollBox>
              </div>
          </div>


      </main>
    </div>
  );
}


