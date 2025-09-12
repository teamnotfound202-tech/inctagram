import { createSlice } from '@reduxjs/toolkit'

export const appSlice = createSlice({
  name: 'appSlice',
  initialState: {
    isLoggedIn: false,
  },
  reducers: create => ({
    loginTC: create.reducer<{ isLoggedIn: boolean }>((state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    }),
  }),

  selectors: {
    selectIsLoggedIn: state => state.isLoggedIn,
  },
})

export const AppSlice = appSlice.reducer
export const { loginTC } = appSlice.actions
export const { selectIsLoggedIn } = appSlice.selectors
