import { configureStore } from '@reduxjs/toolkit';
import { auth } from './slices/auth';
import { serverApi } from './services/serverApi';

export const store = configureStore({
    // Ajout du reducer à notre store (magasin), 
    // ainsi que notre slice "auth" dans lequel se trouve notre token
    reducer: {
        [serverApi.reducerPath]: serverApi.reducer,
        [auth.name]: auth.reducer,
    },
    // Ajouter le middleware API permet d'activer la mise en cache, l'invalidation, le sondage,
    // et d'autres fonctionnalités utiles de `rtk-query`. 
    // Nécessaire pour utiliser la méthode builder.mutation() dans nos endpoints.
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(serverApi.middleware)
})