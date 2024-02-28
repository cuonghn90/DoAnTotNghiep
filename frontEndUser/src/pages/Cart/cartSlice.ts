import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { ICart, IProduct, IProductCart } from "interface";

interface ICartStoreState {
    cart: ICart,
    loading: boolean,
    success: boolean,
    error: any,
    successMessage: string
}

const initialState: ICartStoreState = {
    cart: {
        productsCart: [] as IProductCart[]
    } as ICart,
    loading: false,
    success: false,
    error: null,
    successMessage: ''
};

export const createCart = createAsyncThunk('cart/create-cart',async()=>{
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
            `http://localhost:5000/api/cart/new-cart`,
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
})

export const getCartByUser = createAsyncThunk('carts/get-cart', async ()=>{
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
            `http://localhost:5000/api/cart`,
            config
        );
        return data;
    }
    catch (error: any) {
        return error
    }
})

export const pushProductToCart = createAsyncThunk('cart/push-product',
    async ({ cartId, productId, count, price, note }: any,
        { rejectWithValue }) => {
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
                `http://localhost:5000/api/cart/update-cart`,
                { cartId, productId, count, price, note },
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
    }
); 

export const deleteProductFromCart = createAsyncThunk('cart/delete-product',
    async ({ productCartId }: any,
        { rejectWithValue }) => {
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
                `http://localhost:5000/api/cart/delete-product/${productCartId}`,
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
    }
);

export const deleteCartByUser = createAsyncThunk('cart/delete-cart',async()=>{
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
            `http://localhost:5000/api/cart/`,
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
})

export const getPaymentConfig = async()=>{
    const { data } = await axios.get(
        `http://localhost:5000/api/payment/paypal-key`
    );
    return data;
}

export const CartSlice = createSlice({
    name: 'cartSlice',
    initialState: initialState,
    reducers: {
        resetCart: () => initialState,
        pushProductToCartAction (state, action) {
            const idFoodIsExist = state.cart.productsCart ?  state.cart.productsCart.findIndex(product => product.productId === (action.payload as IProductCart).productId) : -1;
            if (idFoodIsExist >= 0) {
                state.cart.productsCart[idFoodIsExist].count = state.cart.productsCart[idFoodIsExist].count + (action.payload as IProductCart).count;
                state.cart.productsCart = [...state.cart.productsCart]
            }
            else {
                state.cart.productsCart = [...state.cart.productsCart, action.payload];
            }
        },
        deleteProductFromCartAction (state, action) {
            const newListFoodOrder = state.cart.productsCart.filter(product => product.productId !== (action.payload as IProductCart).productId);
            state.cart.productsCart = [...newListFoodOrder];
        },
        changeSuccessToFalse: (state) => {
            state.success = false;
            state.successMessage = '';
        },
        changeErrorToNull: (state) => {
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            //  Create Cart
            .addCase(createCart.pending, (state, action) => {
                state.success = false;
            })
            .addCase(createCart.fulfilled, (state, action) => {
                state.success = true;
                state.cart = action.payload;
                return state;
            })
            .addCase(createCart.rejected, (state, action) => {
                state.success = false;
            })
            // Get Cart
            .addCase(getCartByUser.pending, (state,action)=>{
                state.loading = true
            })
            .addCase(getCartByUser.fulfilled, (state,action)=>{
                state.loading = false;
                state.cart = action.payload
            })
            .addCase(getCartByUser.rejected,(state,action)=>{
                state.loading = false;
            })
            // Push Product To Cart
            .addCase(pushProductToCart.pending, (state,action)=>{
                state.loading = true
                state.success = false
            })
            .addCase(pushProductToCart.fulfilled, (state,action)=>{
                state.loading = false;
                state.success = true;
                state.cart = action.payload
            })
            .addCase(pushProductToCart.rejected,(state,action)=>{
                state.loading = false;
                state.success = false;
            })
            // Delete Product From Cart
            .addCase(deleteProductFromCart.pending, (state,action)=>{
                state.loading = true
                state.success = false
            })
            .addCase(deleteProductFromCart.fulfilled, (state,action)=>{
                state.loading = false;
                state.success = true;
                state.successMessage = 'Xóa sản phẩm khỏi giỏ hàng thành công'
            })
            .addCase(deleteProductFromCart.rejected,(state,action)=>{
                state.loading = false;
                state.success = false;
            })
            // Delete Cart
            .addCase(deleteCartByUser.pending, (state,action)=>{
                state.loading = true
                state.success = false
            })
            .addCase(deleteCartByUser.fulfilled, (state,action)=>{
                state.loading = false;
                state.success = true;
            })
            .addCase(deleteCartByUser.rejected,(state,action)=>{
                state.loading = false;
                state.success = false;
            })
    }
});

export const checkProductIsExistCart = (productId: string, cart: ICart) => {
    const isExist = cart.productsCart ? cart.productsCart.findIndex(product => product.productId === productId) : -1
    if (isExist < 0) {
        return false;
    }
    return true;
};

export const { pushProductToCartAction, deleteProductFromCartAction, resetCart, changeSuccessToFalse, changeErrorToNull } = CartSlice.actions;

export default CartSlice.reducer;