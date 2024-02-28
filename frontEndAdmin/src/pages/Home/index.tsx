import './style.css';
import { IOrder } from 'interface';
import { useEffect, useRef, useState } from 'react';
import { filterOrdersDashboard } from './orderSlice';
import Loading from 'components/Loading/Loading';
import OrderReport from './components/OrderReport';
import { useAppDispatch, useAppSelector } from 'store/hook';
import DashboardPercent from './components/DashboardPercent';
import moneyImage from 'assets/images/money-dashboard.jpg';
import walletImage from 'assets/images/wallet-dashboard.jpg';
import noMoney from 'assets/images/no-payment.jpg';
import cartImage from 'assets/images/cart-dashboard.png';
import { db } from '../../firebase/firebase';
import { doc, onSnapshot, } from "firebase/firestore";
import { formatDateFullYear, getDayEnd, getDayStart } from 'utils/uitls';
import { DatePicker } from 'antd';
import ReactToPrint from 'react-to-print';
import { Bar, Pie } from 'react-chartjs-2';

const { RangePicker } = DatePicker;
const Home = () => {
    const [dataPie, setDataPie] = useState({
        labels: ['Đã thanh toán', 'Chưa thanh toán'],
        datasets: [
            {
                label: '# of Votes',
                data: [0, 0],
                backgroundColor: [
                    'rgb(0, 204, 0)',
                    'rgb(255, 153, 153)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
            },
        ],
    });
    const [chartProduct, setChartProduct] = useState({
        labels: [''],
        datasets: [
            {
                label: "Sản phẩm bán chạy",
                data: [0],
                backgroundColor: [
                    "rgba(75,192,192,1)",
                    "#ecf0f1",
                    "#50AF95",
                    "#f3ba2f",
                    "#2a71d0"
                ],
                borderColor: "black",
                borderWidth: 2,
            }
        ]
    });

    const [chartCustomer, setChartCustomer] = useState({
        labels: [''],
        datasets: [
            {
                label: "Danh sách khách hàng có nhiều đơn",
                data: [0],
                backgroundColor: [
                    "rgba(75,192,192,1)",
                    "#ecf0f1",
                    "#50AF95",
                    "#f3ba2f",
                    "#2a71d0"
                ],
                borderColor: "black",
                borderWidth: 2,
            }
        ]
    });
    // Store
    const dispatch = useAppDispatch();
    const { userInfo } = useAppSelector(state => state.authStore);
    const { loading, orders, productsPopular } = useAppSelector(state => state.orderStore);

    const componentPrint = useRef<HTMLDivElement>(null);

    // useState
    const [listOrderRender, setListOrderRender] = useState([] as Array<IOrder>);
    const [listProductPopular, setListProductPopular] = useState([] as any[]);
    const [listCustomerBuyMany, setListCustomerBuyMany] = useState([] as any[]);
    const [startDateStatic, setStartDateStatic] = useState(formatDateFullYear(new Date()).toString());
    const [endDateStatic, setEndDateStatic] = useState(formatDateFullYear(new Date()).toString());
    const [valueFilter, setValueFilter] = useState('today');
    const [valueDashboard, setValueDashboard] = useState({
        totalMoney: 0,
        totalOrder: 0,
        totalPaid: 0,
        totalUnpaid: 0,
        totalPayOnline: 0,
        totalPayOffline: 0
    });

    // Function
    const handleFilterOrders = async ({ page, limit, startDate, endDate }: any) => {
        const dataOrders = await dispatch(filterOrdersDashboard({ page: page, limit: limit, startDate: startDate, endDate: endDate }));
        if (dataOrders.payload.orders && dataOrders.payload.orders.length > 0) {
            const newValueDashboard = {
                totalMoney: 0,
                totalOrder: 0,
                totalPaid: 0,
                totalUnpaid: 0,
                totalPayOnline: 0,
                totalPayOffline: 0
            };
            dataOrders.payload.orders.map((orderItem: IOrder) => {
                newValueDashboard.totalMoney += orderItem.paymentAmount;
                if (orderItem.paymentStatus == 'Unpaid') {
                    newValueDashboard.totalUnpaid += 1;
                }
                else {
                    newValueDashboard.totalPaid += 1;
                }

                if (orderItem.orderIdPaypal) {
                    newValueDashboard.totalPayOnline += 1;
                }
                else {
                    newValueDashboard.totalPayOffline += 1;
                }
                newValueDashboard.totalOrder += 1;
            });
            setValueDashboard(newValueDashboard);
            setDataPie({
                labels: ['Đã thanh toán', 'Chưa thanh toán'],
                datasets: [
                    {
                        label: '# of Votes',
                        data: [newValueDashboard.totalPaid, newValueDashboard.totalUnpaid],
                        backgroundColor: [
                            'rgb(0, 204, 0)',
                            'rgb(255, 153, 153)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            });
        }
        else {
            const newValueDashboard = {
                totalMoney: 0,
                totalOrder: 0,
                totalPaid: 0,
                totalUnpaid: 0,
                totalPayOnline: 0,
                totalPayOffline: 0
            };
            setValueDashboard(newValueDashboard);
            setDataPie({
                labels: ['Đã thanh toán', 'Chưa thanh toán'],
                datasets: [
                    {
                        label: '# of Votes',
                        data: [newValueDashboard.totalPaid, newValueDashboard.totalUnpaid],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                        ],
                        borderWidth: 1,
                    },
                ],
            });
        }
        setListOrderRender(dataOrders.payload.orders);

        handleProductsPopular();
        handleCustomerBuyMany();
    };

    const handleProductsPopular = () => {
        const arrayProduct: any = {};
        productsPopular.map((productPopular) => {
            if (arrayProduct[productPopular.name]) {
                arrayProduct[productPopular.name] = {
                    ...arrayProduct[productPopular.name],
                    'totalSold': arrayProduct[productPopular.name].totalSold + productPopular.count,
                    'totalMoney': arrayProduct[productPopular.name].totalMoney + productPopular.totalMoney,
                };
            }
            else {
                arrayProduct[productPopular.name] = {
                    'name': productPopular.name,
                    'totalSold': productPopular.count,
                    'totalMoney': productPopular.totalMoney,
                };
            }
        });
        const arrayProductPopular: any[] = [];
        for (const [key, value] of Object.entries(arrayProduct)) {
            arrayProductPopular.push(value);
        }
        setChartProduct({
            labels: arrayProductPopular.map((data) => data.name),
            datasets: [
                {
                    label: "Số lượng đã bán",
                    data: arrayProductPopular.map((data) => data.totalSold),
                    backgroundColor: [
                        "rgba(75,192,192,1)",
                        "#ecf0f1",
                        "#50AF95",
                        "#f3ba2f",
                        "#2a71d0"
                    ],

                    borderColor: "#fff",
                    borderWidth: 2
                }
            ]
        })
        setListProductPopular(arrayProductPopular);
    };

    const handleCustomerBuyMany = () => {
        const arrayUser: any = {};
        orders.map(orderItem => {
            if (arrayUser[orderItem.user.userId]) {
                arrayUser[orderItem.user.userId] = {
                    ...arrayUser[orderItem.user.userId],
                    'totalOrderPurchase': arrayUser[orderItem.user.userId].totalOrderPurchase + 1,
                    'totalMoney': arrayUser[orderItem.user.userId].totalMoney + orderItem.paymentAmountAfterDiscount
                };
            }
            else {
                arrayUser[orderItem.user.userId] = {
                    'username': orderItem.user.username,
                    'totalOrderPurchase': 1,
                    'totalMoney': orderItem.paymentAmountAfterDiscount
                };
            }
        });
        const arrayCustomerBuyMany: any[] = [];

        for (const [key, value] of Object.entries(arrayUser)) {
            arrayCustomerBuyMany.push(value);
        }
        setChartCustomer({
            labels: arrayCustomerBuyMany.map((data) => data.username),
            datasets: [
                {
                    label: "Số lượng đã bán",
                    data: arrayCustomerBuyMany.map((data) => data.totalOrderPurchase),
                    backgroundColor: [
                        "rgba(75,192,192,1)",
                        "#ecf0f1",
                        "#50AF95",
                        "#f3ba2f",
                        "#2a71d0"
                    ],

                    borderColor: "#fff",
                    borderWidth: 2
                }
            ]
        })
        setListCustomerBuyMany(arrayCustomerBuyMany);
    };

    //Function RangPicker
    const handleChangeRangPicker = async (range: any) => {
        const valueOfInput1 = range[0].format();
        const valueOfInput2 = range[1].format();
        setStartDateStatic(formatDateFullYear(valueOfInput1).toString());
        setEndDateStatic(formatDateFullYear(valueOfInput2).toString());
        await handleFilterOrders({ startDate: formatDateFullYear(valueOfInput1), limit: 10, page: 1, endDate: formatDateFullYear(valueOfInput2) });
    };

    const handleChangeFilter = (newValue: string) => {
        const nowDate = new Date();
        setValueFilter(newValue);
        let startDate = getDayStart();
        let endDate = getDayEnd();
        switch (newValue) {
            case 'today':
                handleFilterOrders({ startDate: startDate, limit: 10, page: 1, endDate: endDate });
                break;
            case 'week':
                startDate = getDayStart(new Date(
                    nowDate.getFullYear(),
                    nowDate.getMonth(),
                    nowDate.getDate() - 7,
                ));
                endDate = getDayEnd();
                handleFilterOrders({ startDate: startDate, limit: 10, page: 1, endDate: endDate });
                break;
            case 'month':
                startDate = getDayStart(new Date(
                    nowDate.getFullYear(),
                    nowDate.getMonth() - 1,
                    nowDate.getDate(),
                ));
                endDate = getDayEnd();
                handleFilterOrders({ startDate: startDate, limit: 10, page: 1, endDate: endDate });
                break;
            default:
                handleFilterOrders({ startDate: startDate, limit: 10, page: 1, endDate: endDate });
                break;
        }
    };

    // useEffect
    useEffect(() => {
        handleFilterOrders({ startDate: getDayStart(), limit: 10, page: 1, endDate: getDayEnd() });
    }, []);

    useEffect(() => {
        if (userInfo.userId) {
            const unsub = onSnapshot(doc(db, "notifications", 'admin'), async (docNoti) => {
                if (docNoti.exists()) {
                    if (docNoti.data().notifications) {
                        handleChangeFilter(valueFilter);
                    }
                }
            });

            return () => {
                unsub();
            };
        }
    }, [userInfo.userId]);

    return (
        <>
            {
                userInfo.userId ?
                    <div className='home' >
                        <div className="tool-dashboard">
                            <label>Chọn khoảng thời gian muốn xem thống kê:</label>
                            <RangePicker onChange={handleChangeRangPicker} className='range-date' style={{ margin: '0 10px' }} placeholder={["Ngày bắt đầu", "Ngày kết thúc"]} />
                            <ReactToPrint trigger={() => {
                                return <button className='button-primary btn-print' style={{ backgroundColor: '#fff', color: '#000' }}>In thống kê</button>;
                            }}
                                documentTitle='Thống kê'
                                content={() => componentPrint.current}
                            >

                            </ReactToPrint>
                        </div>
                        <div className="dashboard-up">
                            <div className='col-dashboard-up'>
                                <div className="item-dashboard-up">
                                    <div className="wrap-image-item-dashboard">
                                        <div className="border-image-outside">
                                            <img src={moneyImage} alt="money" className="image-item-dashboard" />
                                        </div>
                                    </div>
                                    <div className="wrap-info-item-dashboard">
                                        <span className="number-display">{valueDashboard.totalMoney}</span>
                                        <span className="text-display">Thu nhập</span>

                                    </div>
                                </div>
                                <div className="item-dashboard-up">
                                    <div className="wrap-image-item-dashboard">
                                        <div className="border-image-outside">
                                            <img src={cartImage} alt="money" className="image-item-dashboard" />
                                        </div>
                                    </div>
                                    <div className="wrap-info-item-dashboard">
                                        <span className="number-display">{valueDashboard.totalOrder}</span>
                                        <span className="text-display">Đơn hàng</span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-dashboard-up'>
                                <div className="item-dashboard-up">
                                    <div className="wrap-image-item-dashboard">
                                        <div className="border-image-outside">
                                            <img src={walletImage} alt="money" className="image-item-dashboard" />
                                        </div>
                                    </div>
                                    <div className="wrap-info-item-dashboard">
                                        <span className="number-display">{valueDashboard.totalPaid}</span>
                                        <span className="text-display">Đã thanh toán</span>
                                    </div>
                                </div>
                                <div className="item-dashboard-up">
                                    <div className="wrap-image-item-dashboard">
                                        <div className="border-image-outside">
                                            <img src={noMoney} alt="money" className="image-item-dashboard" />
                                        </div>
                                    </div>
                                    <div className="wrap-info-item-dashboard">
                                        <span className="number-display">{valueDashboard.totalUnpaid}</span>
                                        <span className="text-display">Chưa thanh toán</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='dashboard-down'>
                            <div className='home-order-report'>
                                {
                                    loading ?
                                        <Loading></Loading> :
                                        <OrderReport orders={listOrderRender}></OrderReport>
                                }
                            </div>
                            <div className='home-most-order-percent'>
                                <div className="home-percent">
                                    {
                                        loading ?
                                            <Loading></Loading> :
                                            <DashboardPercent
                                                percentPayOnline={valueDashboard.totalPayOnline / (valueDashboard.totalPayOnline + valueDashboard.totalPayOffline)}
                                                percentPayOffline={valueDashboard.totalPayOffline / (valueDashboard.totalPayOnline + valueDashboard.totalPayOffline)}></DashboardPercent>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className='component_print' ref={componentPrint}>
                            <div style={{ margin: '0 20px', paddingTop: '20px' }}>
                                <div>
                                    <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '6px', fontSize: '25px' }}>Đồ ăn Việt</div>
                                    <div style={{ textAlign: 'center', fontWeight: 'bold' }}>Báo cáo thống kê</div>
                                    <div style={{
                                        textAlign: 'center'
                                    }}>
                                        <span>Từ ngày: {startDateStatic}</span>
                                        &nbsp;&nbsp;&nbsp;
                                        <span>Đến ngày: {endDateStatic}</span>
                                    </div>
                                </div>
                                <div style={{ marginBottom: '20px', marginTop: '20px', display: 'flex', gap: '20px' }}>
                                    <div style={{width: '50%'}}>
                                        <li>Thống kê đơn hàng:</li>
                                        <table className='table_print'>
                                            <thead>
                                                <tr>
                                                    <th>
                                                        <label>Loại đơn hàng</label>
                                                    </th>
                                                    <th>
                                                        <label>Số lượng</label>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Tất cả đơn hàng</td>
                                                    <td>{valueDashboard.totalOrder}</td>
                                                </tr>
                                                <tr>
                                                    <td>Đã thanh toán</td>
                                                    <td>{valueDashboard.totalPaid}</td>
                                                </tr>
                                                <tr>
                                                    <td>Chưa thanh toán</td>
                                                    <td>{valueDashboard.totalUnpaid}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div style={{ width: '200px', height: '200px !important'  ,color: '#000' }}>
                                        <Pie data={dataPie} style={{ width: '200px', height: '100% important', color: '#000' }}
                                        options={{
                                            plugins:{
                                                title: {
                                                    color: '#000'
                                                }
                                            }
                                        }} />
                                    </div>

                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    <li>Thống kê sản phẩm bán chạy:</li>
                                    <table className='table_print'>
                                        <thead>
                                            <tr>
                                                <th>
                                                    <label>STT</label>
                                                </th>
                                                <th >
                                                    <label className='label_print'>Tên sản phẩm</label>
                                                </th>
                                                <th>
                                                    <label>Số lượng đã bán</label>
                                                </th>
                                                <th style={{ width: '200px !important' }}>
                                                    <label>Tổng tiền</label>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                listProductPopular.length > 0 ?
                                                    listProductPopular.map((item, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td >{index + 1}</td>
                                                                <td style={{ padding: '0 10px ' }}>{item.name}</td>
                                                                <td style={{ padding: '0 10px ' }}>{item.totalSold}</td>
                                                                <td style={{ padding: '0 10px ' }}>{item.totalMoney}</td>
                                                            </tr>
                                                        );
                                                    })
                                                    :
                                                    <></>
                                            }
                                        </tbody>
                                    </table>
                                    <div style={{width: '100%', height: '300px'}}>
                                        <Bar
                                            data={chartProduct}
                                            options={{
                                                plugins: {
                                                    title: {
                                                        display: true,
                                                        text: "Sản phẩm bán chạy",
                                                        color: '#fff'
                                                    },
                                                    legend: {
                                                        display: false,
                                                    },
                                                },
                                                scales: {
                                                    x: {
                                                        ticks: {
                                                            color: "black"
                                                        }
                                                    },
                                                    y: {
                                                        ticks: {
                                                            color: "black"
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                    
                                </div>
                                <div>
                                    <li>Thống kê khách hàng đặt nhiều đơn:</li>
                                    <table className='table_print'>
                                        <thead>
                                            <tr>
                                                <th>
                                                    <label>STT</label>
                                                </th>
                                                <th>
                                                    <label>Tên khách hàng</label>
                                                </th>
                                                <th>
                                                    <label>Số lượng đơn</label>
                                                </th>
                                                <th>
                                                    <label>Tổng tiền</label>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                listCustomerBuyMany.length > 0 ?
                                                    listCustomerBuyMany.map((item, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td style={{ padding: '0 10px ' }}>{item.username}</td>
                                                                <td style={{ padding: '0 10px ' }}>{item.totalOrderPurchase}</td>
                                                                <td style={{ padding: '0 10px ' }}>{item.totalMoney}</td>
                                                            </tr>
                                                        );
                                                    })
                                                    :
                                                    <></>
                                            }
                                        </tbody>
                                    </table>
                                    <div style={{ width: '100%', height: '300px' }}>
                                        <Bar
                                            data={chartCustomer}
                                            options={{
                                                plugins: {
                                                    title: {
                                                        display: true,
                                                        text: "Sản phẩm bán chạy",
                                                        color: '#fff'
                                                    },
                                                    legend: {
                                                        display: false,
                                                    },
                                                },
                                                scales: {
                                                    x: {
                                                        ticks: {
                                                            color: "black"
                                                        }
                                                    },
                                                    y: {
                                                        ticks: {
                                                            color: "black"
                                                        }
                                                    }
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='login-to-view-dashboard'>Bạn chưa đăng nhập</div>
            }
        </>

    );
};
export default Home;