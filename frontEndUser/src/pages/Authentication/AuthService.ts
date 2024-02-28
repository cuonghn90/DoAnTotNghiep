import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5000/api/',
        prepareHeaders: (headers, {getState}) => {
            const token = localStorage.getItem('userToken');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
                return headers;
            }
        },
    }),
    endpoints: (builder) => ({
        getUserDetails: builder.query({
            query: () => ({
                url: 'user/refresh',
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetUserDetailsQuery } = authApi;

export default authApi;