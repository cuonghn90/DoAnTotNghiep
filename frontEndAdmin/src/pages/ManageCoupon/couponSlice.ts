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
    listCouponUsed:[] as ICouponUsed[],
    loading: false,
    success: false,
    error: null,
    coupon: {} as ICoupon,
    successMessage: ''
};


export const createCoupon = createAsyncThunk('coupons/create', async (coupon: ICoupon, { rejectWithValue }) => {
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

        const newCoupon = {
            couponCode: coupon.couponCode,
            discount: coupon.discount,
            startDateDiscount: coupon.startDateDiscount,
            endDateDiscount: coupon.endDateDiscount,
            statusCoupon: coupon.statusCoupon,
            takeBy: coupon.takeBy,
            discountFor: coupon.discountFor
        };
        const { data } = await axios.post(
            `http://localhost:5000/api/coupon/`,
            { ...newCoupon },
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

export const createCouponCode = createAsyncThunk('coupons/create-coupon-code', async (typeCoupon: any, { rejectWithValue }) => {
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
            `http://localhost:5000/api/coupon/create-coupon-code`,
            { typeCoupon },
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
export const updateCoupon = createAsyncThunk('coupons/update', async (coupon: ICoupon, { rejectWithValue }) => {
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
        const newCoupon = {
            discount: coupon.discount,
            startDateDiscount: coupon.startDateDiscount,
            endDateDiscount: coupon.endDateDiscount,
            takeBy: coupon.takeBy,
            discountFor: coupon.discountFor,
            statusCoupon:  coupon.statusCoupon
        };
        const { data } = await axios.put(
            `http://localhost:5000/api/coupon/${coupon.couponId}`,
            { ...newCoupon },
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

export const getCoupons = createAsyncThunk('coupons/get-all', async ({ search, status, startDate, endDate }: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.get(
            `http://localhost:5000/api/coupon?search=${search}&status=${status}&startDate=${startDate}&endDate=${endDate}`,
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


export const deleteCoupon = createAsyncThunk('coupons/delete-coupon', async (couponId: string, { rejectWithValue }) => {
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
            `http://localhost:5000/api/coupon/${couponId}`,
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
            // Create Coupon
            .addCase(createCoupon.pending, (state, action) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(createCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.successMessage = 'Thêm thành công phiếu giảm giá.';
            })
            .addCase(createCoupon.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            })  
            // Create Coupon Code
            .addCase(createCouponCode.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(createCouponCode.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(createCouponCode.rejected, (state, action) => {
                state.loading = false;
            })
            // Update Coupon
            .addCase(updateCoupon.pending, (state, action) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(updateCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.successMessage = 'Sửa thành công phiếu giảm giá.';
            })
            .addCase(updateCoupon.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
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
            // Delete Coupon
            .addCase(deleteCoupon.pending, (state, action) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(deleteCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.successMessage = 'Xóa thành công phiếu giảm giá.';
            })
            .addCase(deleteCoupon.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            })
    }
});
export const { changeErrorToNull, changeStatusSuccessToFalse, changeCouponToNull } = couponSlice.actions;
export default couponSlice.reducer;