import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

export const appSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: create => ({}),
  selectors: {},
})

export const appReducer = appSlice.reducer
export const { } = appSlice.actions
export const { } = appSlice.selectors