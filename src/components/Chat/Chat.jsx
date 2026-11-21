import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

function Chat() {
  const { state } =
    useContext(AppContext);

  return (
    <div className="chat">

      {state.selectedChat ? (
        <>
          <h2>
            {state.selectedChat.name}
          </h2>

          <div>
            Mensajes aquí...
          </div>
        </>
      ) : (
        <h2>
          Selecciona un chat
        </h2>
      )}

    </div>
  );
}

export default Chat;