'use client'

import s from './PostItem.module.scss'
import {Post} from '@/features/publicUserApi/types'
import 'swiper/css';
import {useEffect, useState} from 'react'
import Link from 'next/link'
import {usePathname, useSearchParams} from 'next/navigation'
import {LinkContent} from "@/views/ProfilePosts/PostItem/LinkContent/LinkContent";

type Props = {
    post: Post
}

export const PostItem = ({post}: Props) => {
    const [path, setPath] = useState('');
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const currentSearchParams = new URLSearchParams(searchParams.toString());
        currentSearchParams.set('postId', post.id.toString());
        setPath(`${pathname}?${currentSearchParams.toString()}`);
    }, [pathname, searchParams, post.id]);

    return (
        <li className={s.postItem}>
            <Link href={path} prefetch={false}>
                {/* Передаем управление дочернему компоненту */}
                <LinkContent post={post} />
            </Link>
        </li>
    );
}