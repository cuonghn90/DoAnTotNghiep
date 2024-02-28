import { Popconfirm } from 'antd';
import './style.css';
import { EditFilled, DeleteFilled } from '@ant-design/icons';
import { IProduct } from 'interface';
import Loading from 'components/Loading/Loading';
import { useAppDispatch } from 'store/hook';
import { deleteProduct } from 'pages/ManageFood/productSlice';
interface IProps {
    listFood: Array<IProduct>;
    isLoading: boolean;
    changeProductEditAndOpenModal: Function;
}
const TableFood = ({ listFood, isLoading, changeProductEditAndOpenModal }: IProps) => {
    // store
    const dispatch = useAppDispatch();

    // Functon
    const confirm = async (productId: string) => {
        await dispatch(deleteProduct(productId));
    };
    const cancel = () => {
    };

    return (
        <>
            <div className="m-grid">
                {
                    isLoading ? <Loading></Loading> :
                        <table className="table-food" id='tableFood'>
                            <thead>
                                <tr>
                                    <th className="text-table-left">
                                        <label style={{ width: '150px' }} className="text-table wrap-image-item">Hình ảnh</label>
                                    </th>
                                    <th className="text-table-left">
                                        <label style={{ width: '150px' }} className="text-table name-item">Tên món</label>
                                    </th>
                                    <th className="text-table-left">
                                        <label style={{ width: '100px' }} className="text-table ingredient-item">Số lượng</label>
                                    </th>
                                    <th className="text-table-left">
                                        <label style={{ width: '150px' }} className="text-table price-item">Giá</label>
                                    </th>
                                    <th className="text-table-left">
                                        <label style={{ width: '50px' }} className="text-table available-item">Đã bán</label>
                                    </th>
                                    <th className="text-table-left">
                                        <label style={{ width: '50px' }} className="text-table available-item">Đánh giá</label>
                                    </th>
                                    <th className="text-table-right">
                                        <label style={{ width: '100px' }} className="text-table action-with-item">Chức năng</label>
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="table-food-content tbody-table">
                                {
                                    (listFood && listFood.length > 0 ) ? listFood.map(foodItem => {
                                        return (
                                            <tr className="food-item" key={foodItem.productId}>
                                                <td className="">
                                                    <img src={foodItem ? foodItem.image : ''} alt="" className="image-item" />
                                                </td>
                                                <td className="name-item text-table-left">{foodItem.name}</td>
                                                <td className="ingredient-item text-table-left">{foodItem.quantity}</td>
                                                <td className="price-item">{foodItem.price}</td>
                                                <td className="available-item text-table-left">{foodItem.sold}</td>
                                                <td className="available-item text-table-left">{foodItem.totalRating / 5}</td>
                                                <td className="text-table-right">
                                                    <span className="wrap-btn-action" onClick={() => changeProductEditAndOpenModal(foodItem.productId)}>
                                                        <EditFilled className='icon-action' />
                                                    </span>
                                                    <Popconfirm
                                                        title="Xóa món ăn"
                                                        description="Bạn có chắc chắn muốn xóa món này?"
                                                        onConfirm={() => confirm(foodItem.productId)}
                                                        onCancel={cancel}
                                                        okText="Có"
                                                        cancelText="Không"
                                                    >
                                                        <span className="wrap-btn-action">
                                                            <DeleteFilled className='icon-action' />
                                                        </span>
                                                    </Popconfirm>
                                                </td>
                                            </tr>
                                        );
                                    })
                                    :
                                    <></>
                                }
                            </tbody>
                        </table>
                }
            </div>
        </>
    );
};
export default TableFood;