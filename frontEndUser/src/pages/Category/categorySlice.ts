import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { ICategory } from "interface";
interface CategoryStoreState {
    categorys: ICategory[],
    loading: boolean,
    success: boolean,
    error: any,
    successMessage: string,
    arrayOptionCategory: Array<any>,
    arrayOptionCategory2: Array<any>,
}

const initialState: CategoryStoreState = {
    categorys: [] as ICategory[],
    loading: false,
    success: false,
    error: null,
    successMessage: '',
    arrayOptionCategory: [],
    arrayOptionCategory2: [],
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
                    const categorysArray = action.payload as ICategory[];
                    const listOption = [{ value: '', label: 'Tất cả' }];
                    const listOption2 = [];
                    for (const categoryItem of categorysArray) {
                        listOption.push({ value: categoryItem.categoryId, label: categoryItem.name });
                        listOption2.push({ value: categoryItem.categoryId, label: categoryItem.name });
                    }
                    state.arrayOptionCategory = listOption;
                    state.arrayOptionCategory2 = listOption2;
                }
            })
            .addCase(getCategorys.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});
export const { changeErrorToNull, changeStatusSuccessToFalse } = categorySlice.actions;
export default categorySlice.reducer;