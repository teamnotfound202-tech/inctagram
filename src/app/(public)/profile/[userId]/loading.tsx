import {Loader} from '@/shared/ui/Loader/Loader'

export default function Loading() {
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
            <Loader/>   {/*TODO: дважды срабатывает Loader при перезапросе поста по ссылке*/}
        </div>
    )
}

//TODO : из-за этого файла большая ошибка вылезает.  hook.js:608 React instrumentation encountered an error: Error: We are cleaning up async info that was not on the parent Suspense boundary. This is a bug in React.