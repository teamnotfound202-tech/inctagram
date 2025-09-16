import { createSlice } from '@reduxjs/toolkit'
import { Language, Messages, messages } from '@/shared/lib/locale/message'

export const appSlice = createSlice({
  name: 'appSlice',
  initialState: {
    isLoggedIn: false,
    language: 'en' as Language,
    vacabulary: messages as Record<Language, Messages>,
  },
  reducers: create => ({
    loginTC: create.reducer<{ isLoggedIn: boolean }>((state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    }),
    changeLanguage: create.reducer<{ language: Language }>((state, action) => {
      state.language = action.payload.language
    }),
  }),

  selectors: {
    selectIsLoggedIn: state => state.isLoggedIn,
    selectLanguage: state => state.language,
    selectCurrentMessages: state => state.vacabulary[state.language],
  },
})

export const AppSlice = appSlice.reducer
export const { loginTC, changeLanguage } = appSlice.actions
export const { selectIsLoggedIn, selectLanguage, selectCurrentMessages } = appSlice.selectors
