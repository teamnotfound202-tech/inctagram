import {Path} from '@/shared/config';
import {Button} from '@/shared/ui';
import Link from 'next/link';
import s from './Congratulations.module.scss'
import CongratulationsIcon from './icons/congratulationsIcon.svg'

export const Congratulations = () => {
    return (
        <div className={s.congratulationsWrapper}>
            <h2 className={s.congratulationsTitle}>Congratulations!</h2>
            <p className={s.congratulationsText}>Your email has been confirmed</p>
            <Button className={s.congratulationsBtn} asChild>
                <Link href={Path.SignIn}>Sign In</Link>
            </Button>
            <CongratulationsIcon className={s.congratulationsIcon}/>
        </div>
    )
}