import Sidebar from "../components/Sidebar/Sidebar";
import Chat from "../components/Chat/Chat";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

function Home() {

  const {state}=useContext(AppContext)

  console.log(state)
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

    </div>
  );
}

export default Home;