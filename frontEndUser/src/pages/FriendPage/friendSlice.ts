import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { IFriend } from "interface";
interface FriendStoreState {
    friends: IFriend[],
    friend: IFriend,
    loading: boolean,
    success: boolean,
    error: any,
    successMessage: string,
}

const initialState: FriendStoreState = {
    friends: [] as IFriend[],
    friend: {} as IFriend,
    loading: false,
    success: false,
    error: null,
    successMessage: '',
};

export const getFriends = createAsyncThunk('friends/get-all', async () => {
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
            `http://localhost:5000/api/friend/`,
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
});

export const searchUsersAndFriend = createAsyncThunk('friends/search-users', async (search: string) => {
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
            `http://localhost:5000/api/friend/search-friend?search=${search}`,
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
});

export const getFriend = createAsyncThunk('friends/get-friend', async (friendId: string) => {
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
            `http://localhost:5000/api/friend/${friendId}`,
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
});

export const addFriend = createAsyncThunk('friends/add-friend', async (friendId: string) => {
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
            `http://localhost:5000/api/friend/`,
            {userFriendId: friendId},
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
});

export const acceptRequestFriend = createAsyncThunk('friends/accept-request-friend', async (friendId: string) => {
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
            `http://localhost:5000/api/friend/`,
            { userFriendId: friendId },
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
});

export const updateNumberGiveGift = createAsyncThunk('friends/update-give-gift', async (friendId: string) => {
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
            `http://localhost:5000/api/friend/update-give-gift`,
            { userFriendId: friendId },
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
});

export const deleteRequestAddFriend = createAsyncThunk('friends/delete-request-friend', async (friendId: string) => {
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
            `http://localhost:5000/api/friend/${friendId}`,
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
});

export const deleteFriend = createAsyncThunk('friends/delete-friend', async (friendId: string) => {
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
            `http://localhost:5000/api/friend/${friendId}`,
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
});
export const declineInvited = createAsyncThunk('friends/decline-invited', async (friendId: string) => {
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
            `http://localhost:5000/api/friend/${friendId}`,
            config
        );
        return data;
    }
    catch (error: any) {
        return error;
    }
});

export const friendSlice = createSlice({
    name: 'friend',
    initialState,
    reducers: {
        changeStatusSuccessToFalse (state) {
            state.success = false;
            state.successMessage = '';
        },
        changeErrorToNull (state) {
            state.error = null;
        },
        changeFriendToNull(state){
            state.friend = {} as IFriend
        }
    },
    extraReducers: builder => {
        builder
            // Get Friends
            .addCase(getFriends.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getFriends.fulfilled, (state, action) => {
                state.loading = false;
                state.friends = action.payload;
            })
            .addCase(getFriends.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Friend
            .addCase(getFriend.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getFriend.fulfilled, (state, action) => {
                state.loading = false;
                state.friend = action.payload;
            })
            .addCase(getFriend.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Request Add Friend
            .addCase(addFriend.pending, (state, action) => {
                state.loading = true;
                state.success = false
                state.error = null
            })
            .addCase(addFriend.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = 'Gửi lời mời kết bạn thành công'
                state.error = null;
                state.success = true
            })
            .addCase(addFriend.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false
            })
            // Accept Request 
            .addCase(acceptRequestFriend.pending, (state, action) => {
                state.loading = true;
                state.success = false
                state.error = null
            })
            .addCase(acceptRequestFriend.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.success = true
                state.successMessage = 'Chấp nhận lời mời kết bạn thành công.'
            })
            .addCase(acceptRequestFriend.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false
            })
            // Delete request
            .addCase(deleteRequestAddFriend.pending, (state, action) => {
                state.loading = true;
                state.success = false
                state.error = null
            })
            .addCase(deleteRequestAddFriend.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null
                state.success = true
                state.successMessage = 'Xóa lời mời kết bạn thành công.'
            })
            .addCase(deleteRequestAddFriend.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false
            })
            // Delete Friend
            .addCase(deleteFriend.pending, (state, action) => {
                state.loading = true;
                state.success = false
                state.error = null
            })
            .addCase(deleteFriend.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = 'Xóa bạn thành công'
                state.success = true
                state.error = null
            })
            .addCase(deleteFriend.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false
            })
            // Decline Invited
            .addCase(declineInvited.pending, (state, action) => {
                state.loading = true;
                state.success = false
                state.error = null
            })
            .addCase(declineInvited.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = 'Huỷ lời mời kết bạn thành công'
                state.success = true
                state.error = null
            })
            .addCase(declineInvited.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false
            })
            // Update  Number Give Gift
            .addCase(updateNumberGiveGift.pending, (state, action) => {
                state.loading = true;
                state.success = false
                state.error = null
            })
            .addCase(updateNumberGiveGift.fulfilled, (state, action) => {
                state.loading = false;
                state.successMessage = 'Tặng quà thành công'
                state.success = true
                state.error = null
            })
            .addCase(updateNumberGiveGift.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false
            });
    }
});
export const { changeErrorToNull, changeStatusSuccessToFalse, changeFriendToNull } = friendSlice.actions;
export default friendSlice.reducer;