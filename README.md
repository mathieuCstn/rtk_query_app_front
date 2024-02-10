# RTK Query app front

Ce projet fonctionne avec le projet [rtk_query_mongodb_api](https://github.com/mathieuCstn/rtk_query_mongodb_api) qui est le serveur API utilisé ici.

> [!WARNING]
> Le serveur API ne vérifie pas les tokens JWT. C'est un serveur très simpliste qui communique avec une base de données mongoDB.

# 1. Création d'un state global avec redux toolkit

## 1.1 Création du slice auth pour gérer l'authentification

<ins>src/slices/auth.js</ins>

```js
import { createSlice } from '@reduxjs/toolkit'

export const auth = createSlice({
    // Nom du slice
    name: "auth",
    // state initial
    // Le token sera récupéré avec RTK Query afin de pouvoir vérifier l'authenticité de l'utilisateur.
    initialState: {name: null, token: null},
    // Création des différentes actions qu'on pourra appliquer au state de notre slice "auth"
    reducers: {
        setCredential(state, action) {
            state.token = action.payload
        }
    }
})

// Export de nos actions définies dans nos reducers
export const { setCredential } = auth.actions;
```

<ins>src/store.js</ins>

## 1.2 Création du store 

```js
import { configureStore } from '@reduxjs/toolkit';
import { auth } from './slices/auth';

export const store = configureStore({
    // Ajout des reducers à notre store (magasin)
    reducer: {
        [auth.name]: auth.reducer,
    },
})
```

## 1.3 Connection de notre store à notre application

<ins>src/main.jsx</ins>

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store.js'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Le Provider (Fournisseur) nous permet "d'abonner" notre application à notre store (magasin) et ainsi, rendre disponible le state redux dans toute l'application */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
```

On peut maintenant accéder au state via un `useSelector()`
```jsx
import { useSelector } from 'react-redux'

// Récupérer le nom
useSelector((state) => state.auth.name)
// Récupérer le token
useSelector((state) => state.auth.token)
```

# 2. Création & configuration de notre service (connection à l'API)

## 2.1 Création du service avec `createApi()`

<ins>src/services/serverApi.js</ins>

```js
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
```

## 2.2 Connection du service au store

<ins>src/store.js</ins>

```js
import { configureStore } from '@reduxjs/toolkit';
import { auth } from './slices/auth';
import { serverApi } from './services/serverApi';

export const store = configureStore({
    reducer: {
        // Ajout de notre service
        [serverApi.reducerPath]: serverApi.reducer,
        [auth.name]: auth.reducer,
    },
    // Ajouter le middleware API permet d'activer la mise en cache, l'invalidation, le sondage,
    // et d'autres fonctionnalités utiles de `rtk-query`. 
    // Nécessaire pour utiliser la méthode builder.mutation() dans nos endpoints.
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(serverApi.middleware)
})
```

# 3. Utilisation de nos hooks générés par la fonction `createApi()`

## 3.1 `builder.query()` et son hook `useQuery()`

<ins>src/App.jsx</ins>

```jsx
import { useGetUsersQuery } from './services/serverApi';

function App() {

  /**
   * useQuery() (ici useGetUsersQuery()) sert à récupérer des donnée qui n'apport pas de mutation à ces données.
   * On peut ajouter un argument au hook qui sera récupéré par le endpoint défini dans notre service avec createApi(); la propriété "query" est une callback dont l'argument est celui qu'on insère dans notre hook useQuery().
   * 
   * Ce hook retourne un object qu'on peut destructurer pour récupérer la données mais aussi les états de la requête.
   */
  const { data, error, isLoading } = useGetUsersQuery();

  return (
    <>
      {error ? <>Une erreur est survenu</> :
        isLoading ? <>Chargement...</> :
          data ? (<div>
            {data[0].name}
          </div>) : null}
    </>
  )
}

export default App
```

## 3.2 `builder.mutation()` et son hook `useMutation()`

le hook `useMutation()` (ici `useAddUserMutation()`) nous renvoie un "tuple"[^1],
il s'agit d'une affectation par décomposition :  
L'index[0] renvoie une fonction retournant une `Promise`,  
l'index[1] renvoie un **objet qui contient des propriétés à propos des résultats de la mutation**.

<ins>src/components/NewUserForm.jsx</ins>

```jsx
import { useAddUserMutation } from "../services/serverApi";

export default function NewUserForm() {

    const [addUser, mutationResult] = useAddUserMutation();

    // La fonction est asynchrone; On utilise le mot-clé "async" pour utiliser "await" dans le scope de notre fonction afin de pouvoir attendre le résultat de la Promise.
    const handleSubmit = async (e) => {
        e.preventDefault();
        // On crée un objet qui pourra être traité par le serveur avec la classe FormData et la méthode Object.fromEntries().
        // FormData a le même comportement qu'un tableau d'entrées [clé,valeur]; avec Object.fromEntries() on convertit ce tableau en objet, les entrées deviennent les propriétés de cet objet.
        const formData = new FormData(e.currentTarget);
        console.log(formData.entries());
        const user = await addUser(Object.fromEntries(formData))
        // Affichage du résultat de la Promise.
        console.log(user);
    }

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="newuserform-name">Name :</label>
            <input type="text" id="newuserform-name" name="name" />

            <label htmlFor="newuserform-email">Email :</label>
            <input type="email" id="newuserform-email" name="email" />

            <button type="submit">Envoyer</button>
        </form>
    )
}
```

[^1]: "tuple" c'est le terme utilisé par redux dans sa documentation : https://redux-toolkit.js.org/rtk-query/usage/mutations#performing-mutations-with-react-hooks.
Si vous souhaitez en savoir plus sur les tuples (uplet en français) : https://fr.wikipedia.org/wiki/Uplet


# Ressouces & liens

[quick start: mise en place du store et du service](https://redux-toolkit.js.org/tutorials/rtk-query#setting-up-your-store-and-api-service)

[fetchBaseQuery(): schema d'utilisation courants](https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery#common-usage-patterns)

[createApi(): vue d'ensemble](https://redux-toolkit.js.org/rtk-query/api/created-api/overview)

[requêtes de rtk query: cas d'usage courant](https://redux-toolkit.js.org/rtk-query/usage/queries)

[hooks react avec createApi()](https://redux-toolkit.js.org/rtk-query/api/created-api/hooks)

[slices API: integration à redux](https://redux-toolkit.js.org/rtk-query/api/created-api/redux-integration)