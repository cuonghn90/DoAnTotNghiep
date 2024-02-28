import { Outlet, } from "react-router-dom";
import './style.css';
interface Iprops {
    currentNavbar: string;
}
const SettingContent = ({ currentNavbar }: Iprops) => {

    return (
        <div className='setting-content'>
            <Outlet></Outlet>
        </div>
    );
};
export default SettingContent;