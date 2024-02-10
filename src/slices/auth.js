import { createSlice } from '@reduxjs/toolkit'

// Création de notre slice "auth" qui s'occupera du token dans son state
export const auth = createSlice({
    // Nom du slice
    name: "auth",
    // state initial
    // Le token sera récupéré avec RTK Query pour vérifier que l'utilisateur
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