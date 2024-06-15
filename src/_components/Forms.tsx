import * as PropTypes from 'prop-types'
import * as React from 'react'

export function Button(){
    return (
        <button className='border-none bg-green-500 text-white rounded-lg w-28 h-10 m-6'>Enviar</button>
    );
}

export function Icon (props){
    return <props.icon className="absolute h-5 w-5 text-icone mb-4 ml-4"/>
}

Icon.defaultProps = {
    icon : ""
} 