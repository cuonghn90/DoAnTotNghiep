import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { IProduct } from "interface";
interface ProductStoreState {
    listFood: IProduct[],
    loading: boolean,
    success: boolean,
    error: any,
    product: IProduct,
    successMessage: string;
}

const initialState: ProductStoreState = {
    listFood: [] as IProduct[],
    loading: false,
    success: false,
    error: null,
    product: {} as IProduct,
    successMessage: ''
};


export const createProduct = createAsyncThunk('products/create', async (product: IProduct, { rejectWithValue }) => {
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

        const newProduct = {
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            image: product.image,
            categoryId: product.categoryId,
            brand: product.brand,
            quantity: product.quantity,
            tags: product.tags,
            totalRating: product.totalRating,
        };
        const { data } = await axios.post(
            `http://localhost:5000/api/product/new-product`,
            { ...newProduct },
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

export const updateProduct = createAsyncThunk('products/update', async (product: IProduct, { rejectWithValue }) => {
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
        const newProduct = {
            productId: product.productId,
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            image: product.image,
            categoryId: product.categoryId,
            brand: product.brand,
            quantity: product.quantity,
            sold: product.sold,
            tags: product.tags,
            totalRating: product.totalRating,
        };
        const { data } = await axios.put(
            `http://localhost:5000/api/product/${product.productId}`,
            { ...newProduct },
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

export const getProducts = createAsyncThunk('products/get-all', async ({ search, category }: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.get(
            `http://localhost:5000/api/product/products?search=${search}&categoryId=${category}`,
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
});

export const filterProducts = createAsyncThunk('products/filter-products', async ({ page, limit, search, category }: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.get(
            `http://localhost:5000/api/product?search=${search}&page=${page}&limit=${limit}&categoryId=${category}`,
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
        if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});


export const deleteProduct = createAsyncThunk('products/delete-product', async (productId: string, { rejectWithValue }) => {
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
            `http://localhost:5000/api/product/${productId}`,
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

export const uploadOneImage = createAsyncThunk('file/upload', async (base64: any, { rejectWithValue }) => {
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
        if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const importFileExcel = createAsyncThunk('file/import-excel', async (dataExcel: any, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('userToken');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        console.log(dataExcel.get('fileName'));

        const dataResponse = await axios({
            url: "http://localhost:5000/api/upload/uploadExcel",
            method: "POST",
            data: dataExcel,
        }).then(res => res.data)
        return dataResponse;
    }
    catch (error: any) {
        if (error.response && error.response.data.message) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const foodSlice = createSlice({
    name: 'food',
    initialState,
    reducers: {
        changeStatusSuccessToFalse (state) {
            state.success = false;
            state.successMessage = '';
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
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Product
            .addCase(createProduct.pending, (state, action) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.successMessage = 'Thêm thành công sản phẩm.';
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            })
            // Update Product
            .addCase(updateProduct.pending, (state, action) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.successMessage = 'Sửa thành công sản phẩm.';
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            })
            // Get Products
            .addCase(getProducts.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.listFood = action.payload;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Filter Products
            .addCase(filterProducts.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(filterProducts.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(filterProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Product
            .addCase(deleteProduct.pending, (state, action) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.successMessage = 'Xóa thành công sản phẩm.';
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            })
            // Upload Image Product
            .addCase(uploadOneImage.pending, (state, action) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(uploadOneImage.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(uploadOneImage.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            })
            // Import Excel Product
            .addCase(importFileExcel.pending, (state, action) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(importFileExcel.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.successMessage = action.payload.message as string
            })
            .addCase(importFileExcel.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    }
});
export const { changeErrorToNull, changeStatusSuccessToFalse, changeProductToNull } = foodSlice.actions;
export default foodSlice.reducer;