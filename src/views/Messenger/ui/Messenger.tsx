'use client'
import s from './Messenger.module.scss'
import { Button, Input, ScrollBox } from '@/shared/ui'
import { useAppSelector } from '@/shared/lib/hooks/hooks'
import { selectCurrentMessages } from '@/shared/api/appSlice'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useGetSearchUserInfiniteQuery } from '@/features/publicUserApi/publicUserApi'
import { useGetAllMessagesInfiniteQuery } from '@/features/messengerApi/messengerApi'
import { useInfiniteScroll } from '@/shared/lib/hooks'
import { ListOfSpeakers } from '@/views/Messenger/ui/ListOfSpeakers/ListOfSpeakers'
import Spinner from '@/shared/ui/Spinner/Spinner'
import { MessageItem } from '@/features/messengerApi/types'
import { UserFromSearch } from '@/features/publicUserApi/types'
import { UserInfoBlock } from '@/views/Messenger/ui/UserMessageInfo/UserInfoBlock'
import { MessangerField } from '@/views/Messenger/ui/MessangerField/MessangerField'
import {usePathname} from "next/navigation";
import {getIdFromPath} from "@/views/Messenger/model/helpers";

export const Messenger = () => {
  const messages = useAppSelector(selectCurrentMessages)
  const path = usePathname()
  const conversationId = getIdFromPath(path)
  const [search, setSearch] = useState('')
  const [debounced, setDebounced] = useState('')
  const [selectedUser, setSelectedUser] = useState<{
    userName: string
    avatar: string
    userId: number
  } | null>(null)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(search.trim()), 1000)
    return () => clearTimeout(id)
  }, [search])
  const {
    data: allUsers,
    hasNextPage,
    isFetching,
    isLoading,
    fetchNextPage,
  } = useGetSearchUserInfiniteQuery(
    { search: debounced },
    {
      skip: debounced === '',
      refetchOnMountOrArgChange: true,
    }
  )
  const {
    data,
    hasNextPage: hasNextPageByLatest,
    isFetching: isFetchingByLatest,
    isLoading: isLoadingByLatest,
    fetchNextPage: fetchNextPageByLatest,
  } = useGetAllMessagesInfiniteQuery()

  const dialogs = React.useMemo(() => {
    if (!data) return []

    const allMessages = data.pages.flatMap(p => p.items)

    // Map<partnerId, lastMessage>
    const map = new Map<number, MessageItem>()

    for (const msg of allMessages) {
      const partnerId = msg.ownerId === conversationId ? msg.receiverId : msg.ownerId

      const existing = map.get(partnerId)

      // Берём более новое сообщение
      if (!existing || new Date(msg.createdAt) > new Date(existing.createdAt)) {
        map.set(partnerId, msg)
      }
    }

    return Array.from(map.values())
  }, [data, conversationId])



  const users = allUsers?.pages.flatMap(item => item.items) ?? []
  const usersFromLatestMessages = data?.pages?.flatMap(item => item.items) ?? []
  const usersForRender: MessageItem[] | UserFromSearch[] = !!debounced
    ? users
    : dialogs

  const { observerRef } = useInfiniteScroll({
    hasNextPage: !!debounced ? hasNextPage : hasNextPageByLatest,
    isFetching: !!debounced ? isFetching : isFetchingByLatest,
    enabled: true,
    fetchNextPage: !!debounced ? fetchNextPage : fetchNextPageByLatest,
  })
  const handleSelectActiveUser = (avatarUrl: string, userName: string, userId: number) => {
    setSelectedUser({ avatar: avatarUrl, userName: userName, userId })
  }
  const handleRemoveSelectedUser = () => {
    setSelectedUser(null)
  }

  return (
    <div className={s.messagengerPage}>
      <h2 className={s.title}>{messages.messenger.messages}</h2>
      <div className={s.messagengerContainer}>
        <div className={s.inputContainer}>
          <Input
            id={'usersSearch'}
            className={s.searchInput}
            type="search"
            placeholder={messages.navigation.search}
            onChange={e => setSearch(e.target.value)}
            value={search}
          />
        </div>
        <div className={s.selectedUserContainer}>
          <div className={s.user}>
            {selectedUser?.userId && (
              <UserInfoBlock
                avatarUrl={selectedUser?.avatar || ''}
                userName={selectedUser?.userName || 'NoName'}
              />
            )}

            {selectedUser?.userId && (
              <Button variant={'text'} onClick={handleRemoveSelectedUser}>
                X
              </Button>
            )}
          </div>
        </div>
        <div className={s.listofSpeakers}>
          <ScrollBox>
            {usersForRender.map(user => {
              const isSearchUser = 'firstName' in user

              const partnerId = isSearchUser
                  ? user.id
                  : user.ownerId === conversationId
                      ? user.receiverId
                      : user.ownerId

              const username = isSearchUser
                  ? `${user.firstName} ${user.lastName}`
                  : user.userName

              const avatarUrl = isSearchUser
                  ? user?.avatars?.[1]?.url ?? ''
                  : user?.avatars?.[1]?.url ?? ''

              const message = isSearchUser ? 'no messages now' : user.messageText

              return (
                  <ListOfSpeakers
                      key={partnerId}
                      avatarUrl={avatarUrl}
                      userName={username}
                      message={message}
                      userId={partnerId}
                      selectUser={handleSelectActiveUser}
                      activeClass={partnerId === selectedUser?.userId}
                  />
              )
            })}
            {(isFetching || isLoading || isFetchingByLatest || isLoadingByLatest) && (
              <Spinner
                type="secondary"
                size={16}
                label={messages.common.loading}
                fullWidth
                speed={'5'}
              />
            )}
          </ScrollBox>

          <div ref={observerRef} style={{ height: '1px' }}></div>
        </div>
        <div className={s.messengerFieldContainer}>
          {!selectedUser?.userId ? (
            <div className={s.emptyMessage}>
              <span>Choose who you would like to talk to</span>
            </div>
          ) : (

              <MessangerField  dialogPartnerId={selectedUser.userId}/>


          )}
        </div>
      </div>
    </div>
  )
}
