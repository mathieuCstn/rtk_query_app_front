import { useAddUserMutation } from "../services/serverApi";

export default function NewUserForm() {

    const [addUser] = useAddUserMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const user = await addUser(Object.fromEntries(formData))
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