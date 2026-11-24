import Sidebar from "../components/Sidebar/Sidebar";
import Chat from "../components/Chat/Chat";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

import { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../servicios/firebase";

import { signOut } from "firebase/auth";
import { auth } from "../servicios/firebase";
import { useNavigate } from "react-router-dom"

function Home() {

  const { state, dispatch } = useContext(AppContext);

  console.log(state.user);
  console.log(state.user?.photo);

  const navigate = useNavigate();

  const obtenerUsuarios = async () => {

    console.log("Consultando usuarios...");

    const snapshot =
      await getDocs(collection(db, "users"));

    console.log(snapshot);

    const usuarios =
      snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

    dispatch({
      type: "SET_CHATS",
      payload: usuarios
    });
  };

  const cerrarSesion = async () => {

    await signOut(auth);

    navigate("/");
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  console.log(state);

  return (
    <div className="app">

      <img
        src={state.user?.photo}
        alt="Foto perfil"
        width="60"
      />

      <h2>{state.user?.name}</h2>

      <p>{state.user?.email}</p>

      <Sidebar />

      <Chat />

      <button onClick={cerrarSesion}>
        Cerrar sesión
      </button>

    </div>
  );
}

export default Home;

