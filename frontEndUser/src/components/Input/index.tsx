import './input.css';
import { SearchOutlined } from '@ant-design/icons'; 

interface Iprops{
    valueInput: string | number;
    handleChangeValue: Function
}

const Input = ({ valueInput, handleChangeValue }: Iprops) => {
    return(
        <div className='box-input'>
            <SearchOutlined className='icon-input'/>
            <input className="base-input" type="text" placeholder="Search for food, coffe, etc" value={valueInput} onChange={e => handleChangeValue(e)}></input>
        </div>
    )
}
export default Input;