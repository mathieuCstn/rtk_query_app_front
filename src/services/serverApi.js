import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const serverApi = createApi({
    reducerPath: "serverApi",
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:9500',
        prepareHeaders: (header, { getState }) => {
            header.set('Authorization', `Bearer ${getState().auth.token}`)
            return header
        }
    }),
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => '/user'
        }),
        addUser: builder.mutation({
            query: (user) => ({
                url: 'user/addUser',
                method: 'post',
                body: {
                    name: user.name,
                    email: user.email
                }
            }),
        })
    })
})

export const { useGetUsersQuery, useAddUserMutation } = serverApi;