
import {Button} from "@/shared/ui";
import {useAppSelector} from "@/shared/lib/hooks/hooks";
import {selectCurrentMessages} from "@/shared/api/appSlice";
import {useTerminateAllMutation} from "@/features/devices/api/devicesApi";
import {OtherDevice} from "@/features/devices/api/types";
import s from './ActiveSessions.module.scss'
import { ActiveSessionCard } from '@/shared/ui/ActiveSessionCard/ActiveSessionCard'
import { useRouter } from 'next/navigation'
import { Path } from '@/shared/config'
import { toast } from 'sonner'
import { AlertToast } from '@/shared/ui/Alerts/Alerts'
import { baseApi } from '@/shared/api'

type Props = {
  activeDevices: OtherDevice[]
}

export const ActiveSessions = ({activeDevices}:Props) => {
  const currentLanguageArray = useAppSelector(selectCurrentMessages)
  const router = useRouter()
  const [terminateAll, {isLoading}] = useTerminateAllMutation()

  const handleTerminate = () => {
    terminateAll()
      .unwrap()
      .then(() => {
        router.replace(Path.SignIn)
        baseApi.util.resetApiState()
      })
      .catch(() => {
        toast.custom(() => (
          <AlertToast
            variant="error"
            title={currentLanguageArray.errors.serverError}
            description={currentLanguageArray.errors.serverError}
          />
        ))
      })
  }

  return (
    <div className={s.activeDeviceWrapper}>
      <Button
        className={s.activeDeviceBtn}
        variant={'outline'}
        onClick={handleTerminate}
        disabled={isLoading}
      >
        {currentLanguageArray.devices.terminateAllOtherSession}
      </Button>
      <h3 className={''}>{currentLanguageArray.devices.activeSessions}</h3>

      {activeDevices && activeDevices.length > 0 ? (
        <ul>
          {activeDevices.map(device => (
            <li key={device.deviceId}>
              <ActiveSessionCard activeDevice={device} />
            </li>
          ))}
        </ul>
      ) : (
        <p>{currentLanguageArray.devices.notDevice}</p>
      )}
    </div>
  )
}