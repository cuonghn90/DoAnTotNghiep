import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { ICategory } from "interface";
interface CategoryStoreState {
    categorys: ICategory[],
    loading: boolean,
    success: boolean,
    error: any,
    category: ICategory,
    successMessage: string,
    arrayOptionCategory: Array<any>,
    arrayOptionCategory2: Array<any>,
}

const initialState: CategoryStoreState = {
    categorys: [] as ICategory[],
    loading: false,
    success: false,
    error: null,
    category: {} as ICategory,
    successMessage: '',
    arrayOptionCategory: [],
    arrayOptionCategory2: []
};

export const getCategorys = createAsyncThunk('categorys/get-all', async () => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.get(
            `http://localhost:5000/api/category/`,
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
});
export const getCategory = createAsyncThunk('categorys/get-category', async ({categoryId}:any) => {
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
            `http://localhost:5000/api/category/${categoryId}`,
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
});
export const getCategorysAndProduct = createAsyncThunk('categorys/get-categorys-products', async () => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        const { data } = await axios.get(
            `http://localhost:5000/api/category/get-product-belong`,
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
});
export const updateCategory = createAsyncThunk('categorys/update-category', async ({categoryId, name}:any) => {
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
            `http://localhost:5000/api/category/${categoryId}`,
            { name },
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
});
export const createCategory = createAsyncThunk('categorys/create-category', async ({name}:any) => {
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
            `http://localhost:5000/api/category/`,
            { name },
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
});
export const deleteCategory = createAsyncThunk('categorys/delete-category', async ({categoryId}: any) => {
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
            `http://localhost:5000/api/category/${categoryId}`,
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
});

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        changeStatusSuccessToFalse (state) {
            state.success = false;
            state.successMessage = '';
        },
        changeErrorToNull (state) {
            state.error = null;
        },
        changeCategoryToNull (state) {
            state.category = {} as ICategory;
        }
    },
    extraReducers: builder => {
        builder
            // Get Categorys
            .addCase(getCategorys.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getCategorys.fulfilled, (state, action) => {
                state.loading = false;
                state.categorys = action.payload;
                if (action.payload.length > 0) {
                    const categorysArray = action.payload as ICategory[]
                    const listOption = [{value: '',label: 'Tất cả'}];
                    for (const categoryItem of categorysArray) {
                        listOption.push({ value: categoryItem.categoryId, label: categoryItem.name });
                    }
                    state.arrayOptionCategory2 = listOption;
                }
                
            })
            .addCase(getCategorys.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Category
            .addCase(getCategory.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.category = action.payload;
            })
            .addCase(getCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Categorys and Products
            .addCase(getCategorysAndProduct.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getCategorysAndProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.categorys = action.payload
                if(action.payload.length  > 0){
                    const listOption = []
                    for (const categoryItem of (action.payload as ICategory[])){
                        listOption.push({ value: categoryItem.categoryId, label: categoryItem.name})
                    }
                    state.arrayOptionCategory = listOption
                }
            })
            .addCase(getCategorysAndProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Category
            .addCase(createCategory.pending, (state, action) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.successMessage = 'Thêm thành công danh mục.';
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            })
            // Update Category
            .addCase(updateCategory.pending, (state, action) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.successMessage = 'Sửa thành công danh mục.';
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            })
            // Delete Category
            .addCase(deleteCategory.pending, (state, action) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.successMessage = 'Xóa thành công danh mục.';
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            })
    }
});
export const { changeErrorToNull, changeStatusSuccessToFalse, changeCategoryToNull } = categorySlice.actions;
export default categorySlice.reducer;