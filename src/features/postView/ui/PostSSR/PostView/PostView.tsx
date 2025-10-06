'use client'
import {PostContent} from "@/features/postView/ui/PostSSR/PostView/PostContent/PostContent";
import s from "./PostView.module.scss"
import {PostImage} from "@/features/postView/ui/PostSSR/PostView/PostImage/PostImage";
import {Post} from "@/features/postView/api/types";
import {useFetchPostQuery} from "@/features/posts/api/posts-api";
import { useState } from 'react'
import PostModal from '@/features/postView/ui/PostModal/PostModal'

type Props = {
    post: Post
}

export const PostView = ({post}: Props) => {
      const {data: postFromCache} = useFetchPostQuery(post.id)

    //При первой отрисовке берутся данные с сервера(post), а потом делается запрос с помощью useFetchPostQuery за актуальными данными,
    //для которых важна авторизация (например, isLiked для поста), и кладутся в кэш (postFromCache)
    const postToRender = postFromCache || post
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const deleteHandler = (value:boolean) => {
    setIsDeleteModalOpen(value)
  }

  const editingHandler=(value:boolean)=>{
    setIsEditing(value)
  }

    return (
      <PostModal isEditing={isEditing} isDeleteModalOpen={isDeleteModalOpen}>
        {isEditing  && <p className={s.readTitle}>Edit Post</p>}
        <div className={s.postWrapper }>
          <PostImage images={postToRender.images}/>{/*TODO: добавить слайдер*/}
          <PostContent post={postToRender} editingHandler={editingHandler} isEditing={isEditing} deleteHandler={deleteHandler} isDeleteModalOpen={isDeleteModalOpen} />
        </div>
      </PostModal>

    );
};

