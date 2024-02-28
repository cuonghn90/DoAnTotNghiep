import './input.css';
interface Iprops{
    labelText:string,
    textPlaceHolder: string
}
const Textarea = ({labelText, textPlaceHolder }: Iprops) => {
    return (
        <div className='box-textarea'>
            {
                labelText.length > 0 ? <label className='label-textarea'>{labelText}</label> : ''
            }
            <textarea className="base-textarea" placeholder={textPlaceHolder ? textPlaceHolder : "Search for food, coffe, etc"}></textarea>
        </div>
    );
};
export default Textarea;