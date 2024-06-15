import { configureStore } from '@reduxjs/toolkit'
import userReducer from './User/slice'

const store = configureStore({
    reducer: {user:userReducer,}
})

export default store