import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IUserRegister, IUserLogin, IUserProfile, IBaseUser } from 'interface';
import { db } from "../../firebase/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { getNameOfEmail } from 'utils/uitls';

const userToken = localStorage.getItem('userToken')
    ? localStorage.getItem('userToken')
    : null;

export interface AuthState {
    userInfo: IUserProfile,
    userToken: any,
    users: IBaseUser[],
    loading: boolean,
    success: boolean,
    error: any,
    successMessage: string;
}

const initialState: AuthState = {
    userInfo: {} as IUserProfile,
    userToken: userToken, 
    users: [] as IBaseUser[],
    loading: false,
    success: false,
    error: null,
    successMessage: ''
};

export const getAllUser = createAsyncThunk('auth/get-all-user', async (role: any, { rejectWithValue }) => {
    try {
        const { data } = await axios.get(
            `http://localhost:5000/api/user/users?role=${role}`,
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


export const userRegister = createAsyncThunk(
    'auth/register',
    async ({ email, password, phone }: IUserRegister, { rejectWithValue }) => {
        try {
            const { data: dataUserRegister } = await axios.post(
                `http://localhost:5000/api/user/register-admin`,
                { email, password, phone, username: getNameOfEmail(email), avatar: 'https://t3.ftcdn.net/jpg/02/09/37/00/360_F_209370065_JLXhrc5inEmGl52SyvSPeVB23hB6IjrR.jpg' }
            );
            await setDoc(doc(db, "users", dataUserRegister.userId), {
                userId: dataUserRegister.userId,
                email: email,
                username: getNameOfEmail(email),
                avatar: 'https://t3.ftcdn.net/jpg/02/09/37/00/360_F_209370065_JLXhrc5inEmGl52SyvSPeVB23hB6IjrR.jpg'
            });
            await setDoc(doc(db, "userchats", dataUserRegister.userId), {});
            await setDoc(doc(db, "notifications", dataUserRegister.userId), {});
            return dataUserRegister;
        } catch (error: any) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);



export const userLogin = createAsyncThunk(
    'auth/login',
    async ({ email, password }: IUserLogin, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                }
            };
            const { data } = await axios.post(
                `http://localhost:5000/api/user/login-admin`,
                { email, password },
                {
                    withCredentials:true
                }
            );

            localStorage.setItem('userToken', data.token);
            const userInfo: IUserProfile = {
                email: email,
                avatar: data.avatar,
                firstname: data.firstname,
                lastname: data.lastname,
                phone: data.phone,
                username: data.username,
                userId: data.userId,
                role: data.role,
                token: data.token
            };
            return userInfo;
        } catch (error: any) {
            if (error.response && error.response.data.message) {
                return rejectWithValue(error.response.data);
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const updateInfoUser = createAsyncThunk('auth/update-profile',
    async ({ firstname, lastname, phone, address, dateOfBirth, avatar }: any,
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
                `http://localhost:5000/api/user/update-user`,
                { firstname, lastname, phone, address, dateOfBirth, avatar },
                config
            );

            await updateDoc(doc(db, "users", data.userId), {
                avatar: data.avatar
            });
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

export const forgotPassword = createAsyncThunk('auth/fotgot-password', async ({ email }: any, { rejectWithValue }) => {
    try {
        const { data } = await axios.post(
            `http://localhost:5000/api/user/forgot-password`,
            { email }
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

export const resetPassword = createAsyncThunk('auth/reset-password', async ({ password, token }: any, { rejectWithValue }) => {
    try {

        const { data } = await axios.put(
            `http://localhost:5000/api/user/reset-password/${token}`,
            { password }
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

export const updatePasswordDb = createAsyncThunk('auth/update-password', async ({ password, newPassword }: any, { rejectWithValue }) => {
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
            `http://localhost:5000/api/user/update-password`,
            { password, newPassword },
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

export const refreshPage = createAsyncThunk('auth/refresh-page', async () => {
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
            `http://localhost:5000/api/user/refresh`,
            config
        );
        localStorage.setItem('userToken', data.refreshToken);
        return data;
    }
    catch (error: any) {
        return error;
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('userToken'); 
            state.loading = false;
            state.userInfo = {} as IUserProfile;
            state.userToken = null;
            state.error = null;
        },
        setCredentials: (state, { payload }) => {
            state.userInfo = payload;
        },
        changeSuccessToFalse: (state) => {
            state.success = false;
        },
        changeErrorToNull: (state) => {
            state.error = null;
        },
        setStateError: (state, action) => {
            state.error = action.payload;
        }
    },
    extraReducers: builder => {
        builder
            // get users
            .addCase(getAllUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload
            })
            .addCase(getAllUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // register user
            .addCase(userRegister.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userRegister.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.successMessage = 'Đăng kí tài khoản thành công';
            })
            .addCase(userRegister.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // login user
            .addCase(userLogin.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload || null;
                state.userToken = action.payload?.token;
            })
            .addCase(userLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // update profile
            .addCase(updateInfoUser.pending, (state, action) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateInfoUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload || null;
                state.success = true;
                state.successMessage = 'Cập nhật thông tin thành công';
            })
            .addCase(updateInfoUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            })
            // forgot password
            .addCase(forgotPassword.pending, (state, action) => {
                state.loading = true;
                state.success = false;
                state.error = null
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.successMessage = 'Vui lòng check mail của bạn.';
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload
            })
            // reset password
            .addCase(resetPassword.pending, (state, action) => {
                state.loading = true;
                state.success = false;
                state.error = null
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.successMessage = 'Cập nhật mật khẩu thành công';
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload
            })
            // update password
            .addCase(updatePasswordDb.pending, (state, action) => {
                state.loading = true;
                state.success = false;
                state.error = null
            })
            .addCase(updatePasswordDb.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.successMessage = 'Cập nhật mật khẩu thành công';
            })
            .addCase(updatePasswordDb.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload
            })
            // update password
            .addCase(refreshPage.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(refreshPage.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload || null;
                state.userToken = action.payload?.refreshToken;
            })
            .addCase(refreshPage.rejected, (state, action) => {
                state.loading = false;
            });

    },
});
export const { logout, setCredentials, changeSuccessToFalse, changeErrorToNull, setStateError } = authSlice.actions;
export default authSlice.reducer;