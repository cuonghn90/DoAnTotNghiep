import { Popconfirm } from 'antd';
import './style.css';
import { EditFilled, DeleteFilled } from '@ant-design/icons';
import { ICoupon } from 'interface';
import Loading from 'components/Loading/Loading';
import { useAppDispatch } from 'store/hook';
import { deleteCoupon } from 'pages/ManageCoupon/couponSlice';
import { changeCouponDiscountForToVietNameses, changeCouponStatusToVietNameses, formatDate, formatDateFullYear } from 'utils/uitls';
interface IProps {
    listCoupon: Array<ICoupon>;
    isLoading: boolean;
    changeCouponEditAndOpenModal: Function;
}
const TableCoupon = ({ listCoupon, isLoading, changeCouponEditAndOpenModal }: IProps) => {
    // store
    const dispatch = useAppDispatch();

    // Functon
    const confirm = async (couponId: string) => {
        await dispatch(deleteCoupon(couponId));
    };
    const cancel = () => {
    };

    return (
        <>
            <div className="m-grid">
                {
                    isLoading ? <Loading></Loading> :
                        <table className="table-coupon" id='tableCoupon'>
                            <thead>
                                <tr>
                                    <th className="text-table-left">
                                        <label style={{ width: '150px' }} className="text-table wrap-image-item">Người nhận</label>
                                    </th>
                                    <th className="text-table-left">
                                        <label style={{ width: '150px' }} className="text-table available-item">Mã</label>
                                    </th>
                                    <th className="text-table-left">
                                        <label style={{ width: '150px' }} className="text-table name-item">Trạng thái</label>
                                    </th>
                                    <th className="text-table-left">
                                        <label style={{ width: '150px' }} className="text-table name-item">Sử dụng cho</label>
                                    </th>
                                    <th className="text-table-left">
                                        <label style={{ width: '150px' }} className="text-table ingredient-item">Có hiệu lực</label>
                                    </th>
                                    <th className="text-table-left">
                                        <label style={{ width: '150px' }} className="text-table price-item">Hết hiệu lực</label>
                                    </th>
                                    <th className="text-table-left">
                                        <label style={{ width: '50px' }} className="text-table available-item">Số lượt sử dụng</label>
                                    </th>
                                    <th className="text-table-right">
                                        <label style={{ width: '100px' }} className="text-table action-with-item">Chức năng</label>
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="table-coupon-content tbody-table">
                                {
                                    (listCoupon && listCoupon.length > 0) ? listCoupon.map(couponItem => {
                                        return (
                                            <tr className="coupon-item" key={couponItem.couponId}>
                                                <td className="text-table-left">
                                                    {couponItem.takeBy == 'system' ? 'Tất cả người dùng' : couponItem.takeBy}
                                                </td>
                                                <td className="coupon-code-item text-table-left">{couponItem.couponCode}</td>
                                                <td className="coupon-status-item text-table-left">{changeCouponStatusToVietNameses(couponItem.statusCoupon) }</td>
                                                <td className="coupon-discount-for-item">{changeCouponDiscountForToVietNameses(couponItem.discountFor)}</td>
                                                <td className="coupon-start-time-item text-table-left">{formatDateFullYear(couponItem.startDateDiscount)}</td>
                                                <td className="coupon-end-time-item text-table-left">{formatDateFullYear(couponItem.endDateDiscount)}</td>
                                                <td className="coupon-number-used-item text-table-left">100</td>
                                                <td className="text-table-right">
                                                    <span className="wrap-btn-action" onClick={() => changeCouponEditAndOpenModal(couponItem.couponId)}>
                                                        <EditFilled className='icon-action' />
                                                    </span>
                                                    <Popconfirm
                                                        title="Xóa món ăn"
                                                        description="Bạn có chắc chắn muốn xóa phiếu giảm giá này?"
                                                        onConfirm={() => confirm(couponItem.couponId)}
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
export default TableCoupon;