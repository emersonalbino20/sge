const inicialState = {
    currentUser: false
}
const userReducer = (state = inicialState, action) => {
    
    switch (action.type) {
        case 'visivel':
            return {...state, currentUser:true}    
            break
        case 'invisivel':
                return {...state, currentUser:false}
                break
        default:
            return state
    }
    
}

export default userReducer