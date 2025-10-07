import {Loader} from '@/shared/ui/Loader/Loader'
import PostModal from "@/features/postView/ui/PostModal/PostModal";

export default function Loading() {
    return (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
            <Loader/>
        </div>
    )
}