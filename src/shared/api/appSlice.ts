import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  me:{
    userId: 0,
    userName: '',
    email:'',
    isBlocked: false,
    isLoggedIn: false,
  }
}

export const appSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: create => ({
    meAC: create.reducer<MeType>((state, action) => {
      state.me = action.payload
    }),
    logoutAC: create.reducer(() => initialState),
  }),

  selectors: {
    selectIsBlocked: state => state.me.isBlocked,
    selectUserEmail: state => state.me.email,
    selectUserId: state => state.me.userId,
    selectUserName: state => state.me.userName,
    selectIsLoggedIn: state => state.me.isLoggedIn,
  },
})

export const AppSlice = appSlice.reducer
export const { meAC, logoutAC } = appSlice.actions
export const { selectIsBlocked, selectUserId, selectUserName, selectUserEmail,selectIsLoggedIn } = appSlice.selectors


export type MeType = {
    userId: number,
    userName: string,
    email: string,
    isBlocked: boolean,
    isLoggedIn: boolean,
}