import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { IOrder } from "interface";

export interface IProductPopular{
    name: string,
    count: number,
    price: number,
    totalMoney: number
}
interface IOrdertate {
    orders: IOrder[],
    order: IOrder,
    loading: boolean,
    success: boolean,
    error: any,
    successMessage: string,
    productsPopular: IProductPopular[]
}

const initialState: IOrdertate = {
    orders: [] as IOrder[],
    order: {} as IOrder,
    productsPopular: [] as IProductPopular[],
    loading: false,
    success: false,
    error: null,
    successMessage: ''
}

export const getOrders = createAsyncThunk('orders/get-all', async ({search, status}: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const token = localStorage.getItem('userToken');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        const { data } = await axios.get(
            `http://localhost:5000/api/order/orders?search=${search}&status=${status}`,
            config
        );
        return data;
    }
    catch (error: any) {
        return error
    }
})

export const filterOrders = createAsyncThunk('orders/filter-orders', async ({ page, limit, search, status }: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const token = localStorage.getItem('userToken');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        const { data } = await axios.get(
            `http://localhost:5000/api/order?search=${search}&page=${page}&limit=${limit}&status=${status}`,
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
});

export const filterOrdersDashboard = createAsyncThunk('orders/filter-orders-dashboard', async ({ page, limit, startDate, endDate }: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const token = localStorage.getItem('userToken');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        const { data } = await axios.get(
            `http://localhost:5000/api/order/orders-dashboard?startDate=${startDate}&page=${page}&limit=${limit}&endDate=${endDate}`,
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
});

export const getOrderByUser = createAsyncThunk('orders/get-order', async ({ orderId }: any, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const token = localStorage.getItem('userToken');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        const { data } = await axios.get(
            `http://localhost:5000/api/order/detail-order/${orderId}`,
            config
        );
        return data;
    }
    catch (error: any) {
        if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
        } else {
            return rejectWithValue(error.message);
        }
    }
})

export const updateStatusOrderByUser = createAsyncThunk('orders/update-status-order', async ({ orderId, newStatus }: any, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const token = localStorage.getItem('userToken');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        const { data } = await axios.put(
            `http://localhost:5000/api/order/update-order/${orderId}`,
            { newStatus },
            config
        );
        return data;
    }
    catch (error: any) {
        if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
})

export const updateStatusPaymentByUser = createAsyncThunk('orders/update-status-payment', async ({ orderId, newStatus }: any, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const token = localStorage.getItem('userToken');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        const { data } = await axios.put(
            `http://localhost:5000/api/order/update-payment-status/${orderId}`,
            { newStatus },
            config
        );
        return data;
    }
    catch (error: any) {
        if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
})

export const deleteOrder = createAsyncThunk('orders/delete-order', async (orderId : string, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const token = localStorage.getItem('userToken');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        const { data } = await axios.delete(
            `http://localhost:5000/api/order/delete-order/${orderId}`,
            config
        );
        return data;
    }
    catch (error: any) {
        if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
})
export const deleteOrders = createAsyncThunk('orders/delete-orders', async ({ orderId }: any, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const token = localStorage.getItem('userToken');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        const { data } = await axios.delete(
            `http://localhost:5000/api/order/`,
            config
        );
        return data;
    }
    catch (error: any) {
        if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
})

export const OrderSlice = createSlice({
    name: 'orderSlice',
    initialState: initialState,
    reducers: {
        changeStatusSuccessToFalse (state) {
            state.success = false;
            state.successMessage = '';
        },
        changeErrorToNull (state) {
            state.error = null;
        },
        changeOrderToNull (state) {
            state.order = {} as IOrder;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getOrders.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
            })
            .addCase(getOrders.rejected, (state, action) => {
                state.loading = false;
            })
            //Filter Orders
            .addCase(filterOrders.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(filterOrders.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(filterOrders.rejected, (state, action) => {
                state.loading = false;
            })
            //Filter Orders Dashboard
            .addCase(filterOrdersDashboard.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(filterOrdersDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
                state.productsPopular = action.payload.productsPopular
            })
            .addCase(filterOrdersDashboard.rejected, (state, action) => {
                state.loading = false;
            })
            // Get Order
            .addCase(getOrderByUser.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getOrderByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.order = action.payload;
                return state;
            })
            .addCase(getOrderByUser.rejected, (state, action) => {
                state.loading = false;
            })
            // Update status Order
            .addCase(updateStatusOrderByUser.pending, (state, action) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(updateStatusOrderByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.successMessage = 'Cập nhật trạng thái hóa đơn thành công!'
            })
            .addCase(updateStatusOrderByUser.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
            })
            // Update status Payment
            .addCase(updateStatusPaymentByUser.pending, (state, action) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(updateStatusPaymentByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.successMessage = 'Cập nhật trạng thái thanh toán thành công!'
            })
            .addCase(updateStatusPaymentByUser.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
            })
            // Delete Order
            .addCase(deleteOrder.pending, (state, action) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.successMessage = 'Xóa thành công đơn hàng!'
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
            })
            // Delete Orders
            .addCase(deleteOrders.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(deleteOrders.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(deleteOrders.rejected, (state, action) => {
                state.loading = false;
            });
    }
});

export const { changeStatusSuccessToFalse, changeErrorToNull, changeOrderToNull  } = OrderSlice.actions;
export default OrderSlice.reducer;