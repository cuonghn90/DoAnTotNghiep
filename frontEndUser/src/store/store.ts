
import { Action, Middleware, ThunkAction, configureStore } from '@reduxjs/toolkit';
import ProductReducer from 'pages/Home/productSlice';
import OrderReducer from 'pages/HistoryPage/orderSlice';
import AuthReducer from 'pages/Authentication/AuthenSlice';
import CartReducer from 'pages/Cart/cartSlice';
import FriendReducer from 'pages/FriendPage/friendSlice';
import couponReducer from 'pages/Setting/components/MyCoupon/couponSlice'
import authApi from 'pages/Authentication/AuthService';
import CategoryReducer from 'pages/Category/categorySlice'

// ...
export const store = configureStore({
    reducer: {
        productStore: ProductReducer,
        authStore: AuthReducer,
        cartStore: CartReducer,
        couponStore: couponReducer,
        orderStore: OrderReducer,
        friendStore: FriendReducer,
        categoryStore: CategoryReducer,
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