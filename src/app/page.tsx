import styles from "./page.module.css";
import {Button} from "@/shared/ui/Button/Button";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
          <div>
              <Button>Button</Button>
              <Button  variant={'grayBtn'} fullWidth={true}>Button</Button>
              <Button variant={'transparentBtn'}>Button</Button>
              <Button variant={'linkBtn'}>Button</Button>
          </div>

      </main>
    </div>
  );
}
