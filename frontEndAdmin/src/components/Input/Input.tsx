import './style.css';
import { SearchOutlined } from '@ant-design/icons';
interface Iprops{
    labelText:string,
    textPlaceHolder: string,
    hasIcon: boolean
}
const Input = ({labelText, textPlaceHolder,hasIcon }: Iprops) => {
    return (
        <div className='box-input'>
            {
                labelText.length > 0 ? <label className='label-input'>{labelText}</label> : ''
            }
            {
                hasIcon ? <SearchOutlined className='icon-input' /> : ''
            }
            <input className="base-input" type="text" placeholder={textPlaceHolder ? textPlaceHolder : "Search for food, coffe, etc"}></input>
        </div>
    );
};
export default Input;