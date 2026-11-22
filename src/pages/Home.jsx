import Sidebar from "../components/Sidebar/Sidebar";
import Chat from "../components/Chat/Chat";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

function Home() {

  const {state}=useContext(AppContext)

  console.log(state)
  return (
    <div className="app">

      <Sidebar />

      <Chat />
        <h1>Chat</h1>
      <p>{state.user?.name}</p>
    </div>
  );
}

export default Home;