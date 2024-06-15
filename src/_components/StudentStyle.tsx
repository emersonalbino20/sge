import * as PropTypes from 'prop-types'
import * as React from 'react'


export function Input(props){


 
 return (<input  type={props.type} className="py-6
 w-full
 rounded-form
 outline
 border-3
 border-form
 bg-input
 shadow-none
 mb-6
 pl-10
 " placeholder={props.place}/>);
}

export function Button(){
    return (
        <button className='border-none bg-green-500 text-white rounded-lg w-28 h-10'>Enviar</button>
    );
}

export function Icon (props){
    return <props.icon className="absolute h-5 w-5 text-icone mb-4 ml-4"/>
}
Input.defaultProps = {
    type : "text",
    place: "",
    pl: "0"
}
Input.prototype = {
    type : PropTypes.string,
    place : PropTypes.string,
    pl : PropTypes.string
}
Icon.defaultProps = {
    icon : ""
} 
