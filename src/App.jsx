import { useGetUsersQuery } from './services/serverApi';
import './App.css';
import NewUserForm from './components/NewUserForm';

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
      <NewUserForm />
    </>
  )
}

export default App
