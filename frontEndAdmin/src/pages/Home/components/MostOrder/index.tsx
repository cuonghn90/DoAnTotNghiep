import './style.css';
import { Select } from 'antd';
const MostOrder = () => {
    const handleChange = (value: string) => {
    };
    return (
        <div className='most-order'>
            <div className="most-order-toolbar">
                <div className="title-most-order">Bán chạy</div>
                <div className="toolbar-most-order">
                    <div className="toolbar-item">
                        <Select
                            defaultValue="today"
                            style={{ width: 90 }}
                            onChange={handleChange}
                            options={[
                                { value: 'today', label: 'Hôm nay' },
                                { value: 'week', label: 'Tuần' },
                                { value: 'month', label: 'Tháng' }
                            ]}
                        />
                    </div>
                </div>
            </div>
            <div className="most-order-list">
                <div className="most-order-item">
                    <div className="item-image">
                        <img src='https://i.pinimg.com/236x/04/4d/7a/044d7aaef77a9eb5151a410261d6b5a8.jpg' alt="" className="image-food" />
                    </div>
                    <div className="info-item">
                        <div className="name-item">Food</div>
                        <div className="number-ordered">100</div>
                    </div>
                </div>
                <div className="most-order-item">
                    <div className="item-image">
                        <img src='https://i.pinimg.com/236x/04/4d/7a/044d7aaef77a9eb5151a410261d6b5a8.jpg' alt="" className="image-food" />
                    </div>
                    <div className="info-item">
                        <div className="name-item">Food</div>
                        <div className="number-ordered">100</div>
                    </div>
                </div>
                <div className="most-order-item">
                    <div className="item-image">
                        <img src='https://i.pinimg.com/236x/04/4d/7a/044d7aaef77a9eb5151a410261d6b5a8.jpg' alt="" className="image-food" />
                    </div>
                    <div className="info-item">
                        <div className="name-item">Food</div>
                        <div className="number-ordered">100</div>
                    </div>
                </div>
                <div className="most-order-item">
                    <div className="item-image">
                        <img src='https://i.pinimg.com/236x/04/4d/7a/044d7aaef77a9eb5151a410261d6b5a8.jpg' alt="" className="image-food" />
                    </div>
                    <div className="info-item">
                        <div className="name-item">Food</div>
                        <div className="number-ordered">100</div>
                    </div>
                </div>
                <div className="most-order-item">
                    <div className="item-image">
                        <img src='https://i.pinimg.com/236x/04/4d/7a/044d7aaef77a9eb5151a410261d6b5a8.jpg' alt="" className="image-food" />
                    </div>
                    <div className="info-item">
                        <div className="name-item">Food</div>
                        <div className="number-ordered">100</div>
                    </div>
                </div>
                <div className="most-order-item">
                    <div className="item-image">
                        <img src='https://i.pinimg.com/236x/04/4d/7a/044d7aaef77a9eb5151a410261d6b5a8.jpg' alt="" className="image-food" />
                    </div>
                    <div className="info-item">
                        <div className="name-item">Food</div>
                        <div className="number-ordered">100</div>
                    </div>
                </div>
                <div className="most-order-item">
                    <div className="item-image">
                        <img src='https://i.pinimg.com/236x/04/4d/7a/044d7aaef77a9eb5151a410261d6b5a8.jpg' alt="" className="image-food" />
                    </div>
                    <div className="info-item">
                        <div className="name-item">Food</div>
                        <div className="number-ordered">100</div>
                    </div>
                </div>
                <div className="most-order-item">
                    <div className="item-image">
                        <img src='https://i.pinimg.com/236x/04/4d/7a/044d7aaef77a9eb5151a410261d6b5a8.jpg' alt="" className="image-food" />
                    </div>
                    <div className="info-item">
                        <div className="name-item">Food</div>
                        <div className="number-ordered">100</div>
                    </div>
                </div>
                <div className="most-order-item">
                    <div className="item-image">
                        <img src='https://i.pinimg.com/236x/04/4d/7a/044d7aaef77a9eb5151a410261d6b5a8.jpg' alt="" className="image-food" />
                    </div>
                    <div className="info-item">
                        <div className="name-item">Food</div>
                        <div className="number-ordered">100</div>
                    </div>
                </div>
                <div className="most-order-item">
                    <div className="item-image">
                        <img src='https://i.pinimg.com/236x/04/4d/7a/044d7aaef77a9eb5151a410261d6b5a8.jpg' alt="" className="image-food" />
                    </div>
                    <div className="info-item">
                        <div className="name-item">Food</div>
                        <div className="number-ordered">100</div>
                    </div>
                </div>
                <div className="most-order-item">
                    <div className="item-image">
                        <img src='https://i.pinimg.com/236x/04/4d/7a/044d7aaef77a9eb5151a410261d6b5a8.jpg' alt="" className="image-food" />
                    </div>
                    <div className="info-item">
                        <div className="name-item">Food</div>
                        <div className="number-ordered">100</div>
                    </div>
                </div>
                <div className="most-order-item">
                    <div className="item-image">
                        <img src='https://i.pinimg.com/236x/04/4d/7a/044d7aaef77a9eb5151a410261d6b5a8.jpg' alt="" className="image-food" />
                    </div>
                    <div className="info-item">
                        <div className="name-item">Food</div>
                        <div className="number-ordered">100</div>
                    </div>
                </div>
                <div className="most-order-item">
                    <div className="item-image">
                        <img src='https://i.pinimg.com/236x/04/4d/7a/044d7aaef77a9eb5151a410261d6b5a8.jpg' alt="" className="image-food" />
                    </div>
                    <div className="info-item">
                        <div className="name-item">Food</div>
                        <div className="number-ordered">100</div>
                    </div>
                </div>
                <div className="most-order-item">
                    <div className="item-image">
                        <img src='https://i.pinimg.com/236x/04/4d/7a/044d7aaef77a9eb5151a410261d6b5a8.jpg' alt="" className="image-food" />
                    </div>
                    <div className="info-item">
                        <div className="name-item">Food</div>
                        <div className="number-ordered">100</div>
                    </div>
                </div>
                <div className="most-order-item">
                    <div className="item-image">
                        <img src='https://i.pinimg.com/236x/04/4d/7a/044d7aaef77a9eb5151a410261d6b5a8.jpg' alt="" className="image-food" />
                    </div>
                    <div className="info-item">
                        <div className="name-item">Food</div>
                        <div className="number-ordered">100</div>
                    </div>
                </div>
                <div className="most-order-item">
                    <div className="item-image">
                        <img src='https://i.pinimg.com/236x/04/4d/7a/044d7aaef77a9eb5151a410261d6b5a8.jpg' alt="" className="image-food" />
                    </div>
                    <div className="info-item">
                        <div className="name-item">Food</div>
                        <div className="number-ordered">100</div>
                    </div>
                </div>
                <div className="most-order-item">
                    <div className="item-image">
                        <img src='https://i.pinimg.com/236x/04/4d/7a/044d7aaef77a9eb5151a410261d6b5a8.jpg' alt="" className="image-food" />
                    </div>
                    <div className="info-item">
                        <div className="name-item">Food</div>
                        <div className="number-ordered">100</div>
                    </div>
                </div>
                <div className="most-order-item">
                    <div className="item-image">
                        <img src='https://i.pinimg.com/236x/04/4d/7a/044d7aaef77a9eb5151a410261d6b5a8.jpg' alt="" className="image-food" />
                    </div>
                    <div className="info-item">
                        <div className="name-item">Food</div>
                        <div className="number-ordered">100</div>
                    </div>
                </div>
                <div className="most-order-item">
                    <div className="item-image">
                        <img src='https://i.pinimg.com/236x/04/4d/7a/044d7aaef77a9eb5151a410261d6b5a8.jpg' alt="" className="image-food" />
                    </div>
                    <div className="info-item">
                        <div className="name-item">Food</div>
                        <div className="number-ordered">100</div>
                    </div>
                </div>
                <div className="most-order-item">
                    <div className="item-image">
                        <img src='https://i.pinimg.com/236x/04/4d/7a/044d7aaef77a9eb5151a410261d6b5a8.jpg' alt="" className="image-food" />
                    </div>
                    <div className="info-item">
                        <div className="name-item">Food</div>
                        <div className="number-ordered">100</div>
                    </div>
                </div>
                <div className="most-order-item">
                    <div className="item-image">
                        <img src='https://i.pinimg.com/236x/04/4d/7a/044d7aaef77a9eb5151a410261d6b5a8.jpg' alt="" className="image-food" />
                    </div>
                    <div className="info-item">
                        <div className="name-item">Food</div>
                        <div className="number-ordered">100</div>
                    </div>
                </div>
                <div className="most-order-item">
                    <div className="item-image">
                        <img src='https://i.pinimg.com/236x/04/4d/7a/044d7aaef77a9eb5151a410261d6b5a8.jpg' alt="" className="image-food" />
                    </div>
                    <div className="info-item">
                        <div className="name-item">Food</div>
                        <div className="number-ordered">100</div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MostOrder;