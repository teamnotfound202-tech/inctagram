import {Loader} from '@/shared/ui/Loader/Loader'

export default function Loading() {
  debugger
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', position:'absolute', left:'0', right:'0', top:'0', bottom:'0'}}>
            <Loader/>
        </div>
    )
}

//TODO : из-за этого файла большая ошибка вылезает.  hook.js:608 React instrumentation encountered an error: Error: We are cleaning up async info that was not on the parent Suspense boundary. This is a bug in React.