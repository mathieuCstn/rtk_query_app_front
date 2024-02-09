import { useGetUsersQuery } from './services/serverApi';
import './App.css';
import NewUserForm from './components/NewUserForm';

function App() {

  const { data, error, isLoading } = useGetUsersQuery();
  console.log(data);

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
