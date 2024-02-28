import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { IOrder, IProductOrder } from "interface";

interface IHistoryOrderState {
    orders: IOrder[],
    order: IOrder,
    loading: boolean,
    success: boolean,
    error: any,
    successMessage: string,
    openFormAfterClickNoti: boolean
}

const initialState: IHistoryOrderState = {
    orders: [] as IOrder[],
    order: {} as IOrder,
    loading: false,
    success: false,
    error: null,
    successMessage: '',
    openFormAfterClickNoti: false
};

export const createOrder = createAsyncThunk('orders/create-order', async ({ paymentMethod, address, phone, isPay, orderIdPaypal, paymentAmountAfterDiscount, couponCode }: any, { rejectWithValue }) => {
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
        const { data } = await axios.post(
            `http://localhost:5000/api/order/new-order`,
            { paymentMethod, address, phone, isPay, orderIdPaypal, paymentAmountAfterDiscount, couponCode },
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
});

export const getOrdersByUser = createAsyncThunk('orders/get-all', async ({ search }: any) => {
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
            `http://localhost:5000/api/order/my-order?search=${search}`,
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
});

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
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const deleteOrder = createAsyncThunk('orders/delete-order', async ({ orderId }: any, { rejectWithValue }) => {
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
});

export const cancleOrder = createAsyncThunk('orders/cancle-order', async ({ orderId }: any, { rejectWithValue }) => {
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
            `http://localhost:5000/api/order/cancle-order/${orderId}`,
            { newStatus: "Cancelled"},
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
});

export const deleteOrders = createAsyncThunk('orders/delete-orders', async () => {
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
            `http://localhost:5000/api/order/my-order`,
            config
        );
        return data;
    }
    catch (error: any) {
        return error
    }
});

export const OrderSlice = createSlice({
    name: 'orderSlice',
    initialState: initialState,
    reducers: {
        changeSuccessToFalse: (state) => {
            state.success = false;
            state.successMessage = '';
        },
        changeErrorToNull: (state) => {
            state.error = null;
        },
        setStateError: (state, action) => {
            state.error = action.payload;
        },
        setStateOpenFormAfterClickNoti: (state, action) => {
            console.log(action.payload);
            
            state.openFormAfterClickNoti = action.payload
        }
    },
    extraReducers: builder => {
        builder
            // Create Order
            .addCase(createOrder.pending, (state, action) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.successMessage = "Thanh toán thành công!";
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
            })
            // Get Orders
            .addCase(getOrdersByUser.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getOrdersByUser.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload.orders;
            })
            .addCase(getOrdersByUser.rejected, (state, action) => {
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
            // Delete Order
            .addCase(deleteOrder.pending, (state, action) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(deleteOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.successMessage = 'Xóa thành công đơn hàng'
            })
            .addCase(deleteOrder.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload
            })
            // Delete Order
            .addCase(deleteOrders.pending, (state, action) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(deleteOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.successMessage = 'Xóa thành công đơn hàng'
            })
            .addCase(deleteOrders.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
            })
            // Cancle Order
            .addCase(cancleOrder.pending, (state, action) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(cancleOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.successMessage = 'Hủy thành công đơn hàng'
            })
            .addCase(cancleOrder.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload
            });
    }
});

export const { changeSuccessToFalse, changeErrorToNull, setStateError, setStateOpenFormAfterClickNoti } = OrderSlice.actions;
export default OrderSlice.reducer;