import { configureStore } from '@reduxjs/toolkit';
import { auth } from './slices/auth';
import { serverApi } from './services/serverApi';

export const store = configureStore({
    reducer: {
        [auth.name]: auth.reducer,
        [serverApi.reducerPath]: serverApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(serverApi.middleware)
})