import Sidebar from "../components/Sidebar/Sidebar";
import Chat from "../components/Chat/Chat";

import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";

import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../servicios/firebase";

import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import "./Home.css";

function Home() {
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  const obtenerUsuarios = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));

      const usuarios = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data(),
      }));

      dispatch({
        type: "SET_CHATS",
        payload: usuarios,
      });
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const cerrarSesion = async () => {
  try {
    await signOut(auth);

    dispatch({
      type: "LOGOUT"
    });

    navigate("/");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  return (
    <div className="home-container">

      {/* PANEL IZQUIERDO */}
      <aside className={`home-sidebar ${
        state.selectedChat ? "sidebar-selected" : ""
      }`}>

        <div className="home-user">
          <div className="home-user-info">
            <img
              src={state.user?.photo || "/default-avatar.png"}
              alt="Foto de perfil"
              className="home-avatar"
            />

            <div className="home-user-details">
              <strong>{state.user?.name}</strong>
              <span>{state.user?.email}</span>
            </div>
          </div>

          <button
            className="logout-button"
            onClick={cerrarSesion}
            title="Cerrar sesión"
          >
            <span>↪️</span>
          </button>
        </div>

        <div className="home-sidebar-content">
          <Sidebar />
        </div>

      </aside>

      {/* PANEL DERECHO */}
      <main className={`home-chat ${
        state.selectedChat ? "chat-selected" : ""
      }`}>
       
        <Chat
            key={
            state.selectedChat?.uid ||
             state.selectedChat?.id ||
            "sin-chat"
           }
         />
      </main>

    </div>
  );
}

export default Home;



