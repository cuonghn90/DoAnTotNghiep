import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import AuthReducer from 'pages/Authentication/AuthenSlice';
import authApi from 'pages/Authentication/AuthenService';
import FoodReducer from 'pages/ManageFood/productSlice'
import CouponReducer from 'pages/ManageCoupon/couponSlice'
import OrderReducer from 'pages/Home/orderSlice'
import CategoryReducer from 'pages/Category/categorySlice'

export const store = configureStore({
    reducer: {
        authStore: AuthReducer,
        productStore: FoodReducer,
        orderStore: OrderReducer,
        categoryStore: CategoryReducer,
        couponStore: CouponReducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false, }).concat(authApi.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;