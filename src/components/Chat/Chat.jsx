import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";

function Chat() {

  const { state } = useContext(AppContext);

  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);

  const enviarMensaje = (e) => {

    e.preventDefault();

    if (!mensaje.trim()) return;

    const nuevoMensaje = {
      texto: mensaje,
      usuario: state.user.name
    };

    setMensajes([
      ...mensajes,
      nuevoMensaje
    ]);

    setMensaje("");
  };

  return (
    <div className="chat">

      {state.selectedChat ? (
        <>

          <h2>
            {state.selectedChat.name}
          </h2>

          <div
            style={{
              minHeight: "300px",
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px"
            }}
          >

            {mensajes.map((msg, index) => (

              <div key={index}>
                <strong>
                  {msg.usuario}
                </strong>

                <p>{msg.texto}</p>
              </div>

            ))}

          </div>

          <form onSubmit={enviarMensaje}>

            <input
              type="text"
              placeholder="Escribe un mensaje"
              value={mensaje}
              onChange={(e) =>
                setMensaje(e.target.value)
              }
            />

            <button type="submit">
              Enviar
            </button>

          </form>

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