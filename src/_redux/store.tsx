import { configureStore } from '@reduxjs/toolkit'
import userReducer from './User/slice'
import studentUpdateSlice from './studentUpdateSlice'

const store = configureStore({
    reducer: {
        user:userReducer,
        student:studentUpdateSlice,
    }
})

export default store