import { changeStatusOrderToVietNameses, formatDate } from 'utils/uitls';
import './style.css';
import { IOrder } from 'interface';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import { useAppSelector } from 'store/hook';

interface IProps {
    orders: IOrder[];
}

Chart.register(CategoryScale);
const OrderReport = ({ orders }: IProps) => {
    const { productsPopular } = useAppSelector(state => state.orderStore);
    const [chartData, setChartData] = useState({
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
    useEffect(() => {
        if (orders.length > 0) {
            const arrayProduct: any = {};
            productsPopular.map((productPopular) => {
                if (arrayProduct[productPopular.name]) {
                    arrayProduct[productPopular.name] = {
                        ...arrayProduct[productPopular.name],
                        'totalSold': arrayProduct[productPopular.name].totalSold + productPopular.count
                    };
                }
                else {
                    arrayProduct[productPopular.name] = {
                        'name': productPopular.name,
                        'totalSold': productPopular.count
                    };
                }
            });
            console.log(arrayProduct);
            const newDataChart: any[] = [];
            for (const property in arrayProduct) {
                newDataChart.push({
                    id: property,
                    name: arrayProduct[property].name,
                    totalSold: arrayProduct[property].totalSold,
                });
            }
            setChartData({
                labels: newDataChart.map((data) => data.name),
                datasets: [
                    {
                        label: "Số lượng đã bán",
                        data: newDataChart.map((data) => data.totalSold),
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
            });
        }
        else {
            setChartData({
                labels: [''],
                datasets: [
                    {
                        label: "Số lượng đã bán",
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
        }
    }, [orders.length]);
    return (
        <div className='order-report'>
            <Bar
                data={chartData}
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
                                color: "white"
                            }
                        },
                        y: {
                            ticks: {
                                color: "white"
                            }
                        }
                    }
                }}
            />
        </div>
    );
};
export default OrderReport;