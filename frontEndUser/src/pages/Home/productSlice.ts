import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IComment, IProduct } from 'interface';
import { RootState } from 'store/store';

interface IProductStoreState {
    listProduct: IProduct[],
    loading: boolean,
    success: boolean,
    error: any,
    fetchStatus: string,
    product: IProduct,
    comments: IComment[]
}

const initialState: IProductStoreState = {
    listProduct: [] as IProduct[],
    loading: false,
    success: false,
    error: null,
    fetchStatus: 'idle',
    product: {} as IProduct,
    comments: []
} 

export const getProducts = createAsyncThunk('products/get-all', async ({ search, category,tag }: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.get(
            `http://localhost:5000/api/product/products?search=${search}&categoryId=${category}&tag=${tag}`,
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
});

export const filterProducts = createAsyncThunk('products/filter-products', async ({ page, limit, search, category, sort, sortPrice , tag}: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.get(
            `http://localhost:5000/api/product?search=${search}&page=${page}&limit=${limit}&categoryId=${category}&sort=${(sort ? sort : '')}&sortPrice=${(sortPrice ? sortPrice : '')}&tag=${tag}`,
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
});

export const getProduct = createAsyncThunk('products/get-product', async (productId: string, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.get(
            `http://localhost:5000/api/product/${productId}`,
            config
        );
        return data;
    }
    catch (error: any) {
        // return custom error message from API if any
        if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
export const getProductByName = createAsyncThunk('products/get-product', async (name: string, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.post(
            `http://localhost:5000/api/product/get-product-chat-bot`,
            {name},
            config
        );
        return data;
    }
    catch (error: any) {
        // return custom error message from API if any
        if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const ratingProduct = createAsyncThunk('products/rating', async ({productId, star} : any, { rejectWithValue })=>{
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
            `http://localhost:5000/api/rating/`,
            { productId, star },
            config
        );
        return data;
    }
    catch (error: any) {
        // return custom error message from API if any
        if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data.message);
        } else {
            return rejectWithValue(error.message);
        }
    }
})

export const commentProduct = createAsyncThunk('products/comment', async ({ productId, text }: any, { rejectWithValue }) => {
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
            `http://localhost:5000/api/comment/`,
            { productId, text },
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

export const getCommentsOfProduct = createAsyncThunk('products/get-comments', async (productId : string, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(
            `http://localhost:5000/api/comment/${productId}`,
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

export const uploadOneImage = createAsyncThunk('file/upload', async (base64: any) => {
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
        const { data } = await axios
            .post("http://localhost:5000/api/upload/uploadImage", { image: base64 });
        return data;
    }
    catch (error: any) {
        return error;
    }
});



export const ProductSlice = createSlice({
    name: 'dish',
    initialState,
    reducers: {
        changeStatusSuccessToFalse (state) {
            state.success = false;
        },
        changeErrorToNull (state) {
            state.error = null;
        },
        changeProductToNull (state) {
            state.product = {} as IProduct;
        }
    },
    extraReducers: builder => {
        builder
            // Get Product
            .addCase(getProduct.pending, (state, action) => {
                state.loading = true;
                state.fetchStatus = 'pending';
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.fetchStatus = 'fulfiled';
                state.product = action.payload;
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.loading = false;
                state.fetchStatus = 'rejected';
            })
            // Get Products
            .addCase(getProducts.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.listProduct = action.payload;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = false;
            })
            // Filter Products
            .addCase(filterProducts.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(filterProducts.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(filterProducts.rejected, (state, action) => {
                // state.loading = false;
                state.error = action.payload;
            })
            // Rating Product
            .addCase(ratingProduct.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(ratingProduct.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(ratingProduct.rejected, (state, action) => {
                state.loading = false;
            })
            // Create Comment Product
            .addCase(commentProduct.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(commentProduct.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(commentProduct.rejected, (state, action) => {
                state.loading = false;
            })
            // Get Comment Product
            .addCase(getCommentsOfProduct.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getCommentsOfProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = action.payload
            })
            .addCase(getCommentsOfProduct.rejected, (state, action) => {
                state.loading = false;
            })
    }
});

export const { changeStatusSuccessToFalse, changeErrorToNull, changeProductToNull } = ProductSlice.actions;
export default ProductSlice.reducer;