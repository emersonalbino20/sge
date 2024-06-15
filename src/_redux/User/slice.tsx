import { createSlice } from "@reduxjs/toolkit";



export const slice = createSlice({
    name: 'visivel',
    initialState : {
        currentUser: false, student: ''
    },
    reducers: {
        logged: (state, {payload}) => {
            return {...state, currentUser: true, student: payload}
        },
        logout: (state) => {
            return {...state, currentUser: false}
        }
        }

    }
)

export const {logged, logout} = slice.actions
export  const selector = state => state.visivel
export default slice.reducer