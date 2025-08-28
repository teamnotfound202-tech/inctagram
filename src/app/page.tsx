
import {Button} from "@/shared/ui/Button/Button";
import { ArrowRightIcon } from '@radix-ui/react-icons';


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

      </main>
    </div>
  );
}
