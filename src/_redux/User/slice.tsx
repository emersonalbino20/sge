import { createSlice } from "@reduxjs/toolkit";



export const slice = createSlice({
    name: 'visivel',
    initialState : {
        currentUser: false, student: ''
    },
    reducers: {
        modify: (state, {payload}) => {
            return {...state, currentUser: true, student: payload}
        }
        }

    }
)

export const {modify} = slice.actions
export  const selector = state => state.visivel
export default slice.reducer