import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const serverApi = createApi({
    reducerPath: "serverApi",
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:9500'
    }),
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: () => '/user'
        })
    })
})

export const { useGetUsersQuery } = serverApi;