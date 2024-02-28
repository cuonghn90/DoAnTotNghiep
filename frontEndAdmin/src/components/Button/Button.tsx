import { ReactElement, ReactText } from 'react';
import './style.css'

export interface ButtonProps{
    children: ReactElement | ReactText,
    handleClick: Function,
    btnClassName?: String | ""
}
const Button = ({ children, handleClick, btnClassName }: ButtonProps) => {
    return(
        <button className={btnClassName + " button-primary"} onClick={()=>handleClick()}>
            {children}
        </button>
    )
}
export default Button;