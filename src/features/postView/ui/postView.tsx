'use client'
import {Modal} from "@/shared/ui/Modal/Modal";
import {useFetchPostQuery} from "@/features/postView/api/postApi";
import {PostContent} from "@/features/postView/ui/PostContent/PostContent";


type Props = {};
export const PostView = (props: Props) => {
    const {data: post} = useFetchPostQuery('1')
    if (!post) return <div>Loading...</div>;
    return (
        <>
            <Modal title={'My modal'} onClick={() => {
            }}>

                <PostContent post={post}/>
            </Modal>
        </>
    );
};