import { useAddUserMutation } from "../services/serverApi";

export default function NewUserForm() {

    /**
     * le hook useMutation() (ici useAddUserMutation()) nous renvoie un "tuple"[^1],
     * il s'agit d'une affectation par décomposition. 
     * L'index[0] renvoie une fonction retournant une Promise,
     * l'index[1] renvoie un objet qui contient des propriétés à propos des résultats de la mutation.
     * 
     * [^1]: "tuple" c'est le terme utilisé par redux dans sa documentation : https://redux-toolkit.js.org/rtk-query/usage/mutations#performing-mutations-with-react-hooks.
     * Si vous souhaitez en savoir plus sur les tuples (uplet en français) : https://fr.wikipedia.org/wiki/Uplet
     */
    const [addUser, /* mutationResult */] = useAddUserMutation();

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