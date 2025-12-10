import { createSlice, isPending, isFulfilled, isRejected } from '@reduxjs/toolkit'
import { Language, Messages, messages } from '@/shared/lib/locale/message'

type InitialState = {
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    language: Language,
    vacabulary: Record<Language, Messages>,
    searchChatUserName: string
}

const initialState: InitialState = {
    status: 'idle',
    language: 'en',
    vacabulary: messages,
    searchChatUserName:''
}

export const appSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: create => ({
    changeLanguage: create.reducer<{ language: Language }>((state, action) => {
      state.language = action.payload.language
    }),
      changeSearchChatUserName: create.reducer<{ searchChatUserName: string }>((state, action) => {
          state.searchChatUserName = action.payload.searchChatUserName
      }),
  }),
  extraReducers: (builder) => {
      builder
          .addMatcher(isPending, (state) => {
          state.status = 'loading'
          })
          .addMatcher(isFulfilled, (state) => {
              state.status = 'succeeded'
          })
          .addMatcher(isRejected, (state) => {
              state.status = 'failed'
          })
  },
  selectors: {
      selectStatus: state => state.status,
      selectLanguage: state => state.language,
      selectCurrentMessages: state => state.vacabulary[state.language],
      selectSearchChatUserName: state => state.searchChatUserName,
  },
})

export const appReducer = appSlice.reducer
export const { changeLanguage, changeSearchChatUserName } = appSlice.actions
export const { selectLanguage, selectCurrentMessages, selectStatus, selectSearchChatUserName } = appSlice.selectors