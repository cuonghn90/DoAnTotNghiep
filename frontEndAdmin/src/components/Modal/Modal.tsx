import './style.css';
const Modal = () => {
    return (
        <div className="m-form">
            <div className="m-form-model">
                <div className="m-form-detail" id="form-add">
                    <div className="m-form-header">
                        <div className="m-form-title">Thông tin nhân viên</div>
                        <slot name="groupCheckbox"></slot>
                        <div className="m-form-icons">
                            <slot name="icon"></slot>
                            <div className="m-form-icon" onClick={() => { }}>
                            </div>
                        </div>
                    </div>
                    <div className="m-form-body">
                        <slot name="bodyForm"></slot>
                    </div>
                    <div className="m-form-footer">
                        <div className="m-form-btns-left">
                        </div>
                        <div className="m-form-btns-right">
                        </div>
                    </div >
                </div >
            </div >
        </div >
    );
};
export default Modal;