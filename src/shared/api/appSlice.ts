import { createSlice, isPending, isFulfilled, isRejected } from '@reduxjs/toolkit'

type InitialState = {
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState = {
    status: 'idle'
}

export const appSlice = createSlice({
  name: 'appSlice',
  initialState,
  reducers: () => ({}),
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
      selectStatus: state => state.status
  },
})

export const appReducer = appSlice.reducer
export const { } = appSlice.actions
export const {selectStatus} = appSlice.selectors