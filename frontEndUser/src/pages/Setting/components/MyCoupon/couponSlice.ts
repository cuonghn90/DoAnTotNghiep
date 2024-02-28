import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { ICoupon, ICouponUsed, IProduct } from "interface";
interface CouponStoreState {
    listCoupon: ICoupon[],
    listCouponUsed: ICouponUsed[],
    loading: boolean,
    success: boolean,
    error: any,
    coupon: ICoupon,
    successMessage: string;
}

const initialState: CouponStoreState = {
    listCoupon: [] as ICoupon[],
    listCouponUsed: [] as ICouponUsed[],
    loading: false,
    success: false,
    error: null,
    coupon: {} as ICoupon,
    successMessage: ''
};


export const getCoupons = createAsyncThunk('coupons/get-all', async ({ search, status, startDate, endDate }: any) => {
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
            `http://localhost:5000/api/coupon/coupon-user-used?search=${search}&status=${status}&startDate=${startDate}&endDate=${endDate}`,
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
});

export const filterCoupons = createAsyncThunk('coupons/filter-coupons', async ({ page, limit, search, status, startDate, endDate }: any) => {
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
            `http://localhost:5000/api/coupon/filter?page=${page}&limit=${limit}&search=${search}&status=${status}&startDate=${startDate}&endDate=${endDate}`,
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
});

export const getCoupon = createAsyncThunk('coupons/get-coupon', async (productId: string, { rejectWithValue }) => {
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
            `http://localhost:5000/api/coupon/${productId}`,
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

export const createCouponsUsed = createAsyncThunk('coupons/create-coupon-used', async ({ couponCode }: any) => {
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
            `http://localhost:5000/api/coupon/coupon-used`,
            {couponCode},
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
});

export const giveCoupon = createAsyncThunk('coupons/give-coupon', async ({ discount, takeBy }: any) => {
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
            `http://localhost:5000/api/coupon/give-gift`,
            { discount, takeBy },
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
});

export const couponSlice = createSlice({
    name: 'coupon',
    initialState,
    reducers: {
        changeStatusSuccessToFalse (state) {
            state.success = false;
            state.successMessage = '';
        },
        changeErrorToNull (state) {
            state.error = null;
        },
        changeCouponToNull (state) {
            state.coupon = {} as ICoupon;
        }
    },
    extraReducers: builder => {
        builder
            // Get Coupon
            .addCase(getCoupon.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.coupon = action.payload;
            })
            .addCase(getCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Coupons
            .addCase(getCoupons.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getCoupons.fulfilled, (state, action) => {
                state.loading = false;
                state.listCoupon = action.payload;
            })
            .addCase(getCoupons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Filter Coupons
            .addCase(filterCoupons.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(filterCoupons.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(filterCoupons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Give Coupons
            .addCase(giveCoupon.pending, (state, action) => {
                state.loading = true;
                state.success = false
            })
            .addCase(giveCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.successMessage = 'Tặng quà thành công.'
            })
            .addCase(giveCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false
            })
    }
});
export const { changeErrorToNull, changeStatusSuccessToFalse, changeCouponToNull } = couponSlice.actions;
export default couponSlice.reducer;