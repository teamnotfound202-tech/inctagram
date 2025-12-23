import { createSlice, isPending, isFulfilled, isRejected } from '@reduxjs/toolkit'
import { Language, Messages, messages } from '@/shared/lib/locale/message'

type InitialState = {
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  language: Language
  vacabulary: Record<Language, Messages>
  currentDialogId: number | undefined
}

const initialState: InitialState = {
    status: 'idle',
    language: 'en',
    vacabulary: messages,
    currentDialogId: undefined
}

export const appSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: create => ({
    changeLanguage: create.reducer<{ language: Language }>((state, action) => {
      state.language = action.payload.language
    }),
    changeCurrentDialogId: create.reducer<{dialogId: number}>((state, action) => {
      state.currentDialogId = action.payload.dialogId
    })
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
      selectCurrentDialogId: state => state.currentDialogId
  },
})

export const appReducer = appSlice.reducer
export const { changeLanguage, changeCurrentDialogId } = appSlice.actions
export const {
  selectLanguage,
  selectCurrentMessages,
  selectStatus,
  selectCurrentDialogId
} = appSlice.selectors