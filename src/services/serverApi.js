import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// On exporte l'api pour faire la connexion avec le store
export const serverApi = createApi({
    // Nom du service
    reducerPath: "serverApi",
    // Configuration des requêtes AJAX
    baseQuery: fetchBaseQuery({
        // Définition de l'address de l'API
        baseUrl: 'http://localhost:9500',
        // Préparation de l'entête pour les requêtes demandant un token (JWT)
        prepareHeaders: (header, { getState }) => {
            // On "set" l'option "Authorization" pour envoyer le token (JWT)
            // getState() nous permet d'accéder directement au state global, et donc à notre token
            header.set('Authorization', `Bearer ${getState().auth.token}`)
            // On pense à renvoyer l'entête
            return header
        }
    }),
    // Définition des enpoints
    // Le builder à deux méthodes: 
    // - builder.query() pour accéder à une donnée sans mise à jour des données
    // - builder.mutation() pour envoyer des requêtes qui peuvent apporter des modifications
    endpoints: (builder) => ({
        getUsers: builder.query({
            // On retourne directement le endpoint
            query: () => '/user'
        }),
        getOneUser: builder.query({
            // On peut aussi retourner un utilisateur par son id; Il faudra utiliser le hook useGetOneUserQuery(id) dans ce cas d'exemple.
            query: (id) => `/user/${id}`
        }),
        addUser: builder.mutation({
            // Ici notre service doit envoyer des requêtes de mises à jour à notre serveur. Dans ce cas nous utilisons builder.mutation() qui a la capacité de mettre à jour aussi le cache local.
            query: (user) => ({
                url: 'user/addUser',
                // On peut choisir le type de requête http à envoyer à la route. Ici nous utilisons la méthode "post".
                method: 'post',
                // On définit le body qui sera récupéré et traité par le serveur.
                body: {
                    name: user.name,
                    email: user.email
                }
            }),
        })
    })
})

// On récupère et on exporte les hooks
export const { useGetUsersQuery, useAddUserMutation } = serverApi;