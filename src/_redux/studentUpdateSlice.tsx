import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
    name: 'updateSlice',
    initialState: {
        student: '',
        id: 0,
    },
    reducers: {
        updateStudent(state, {payload}){
            return {...state, id:payload, student: payload}
        },
        cleanStudent(state){
            return {student: '', id: 0}
        }
    }
})

export const {updateStudent, cleanStudent} = slice.actions
export const selectStudent = state => state.student
export const selectStudentId = state => state.student.id
export default slice.reducer