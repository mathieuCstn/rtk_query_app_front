import { createSlice } from '@reduxjs/toolkit'

export const auth = createSlice({
    name: "auth",
    initialState: {name: null, token: null},
    reducers: {
        setCredential(state, action) {
            state.token = action.payload
        }
    }
})

export const { setCredential } = auth.actions;