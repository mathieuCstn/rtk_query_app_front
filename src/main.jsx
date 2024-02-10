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
