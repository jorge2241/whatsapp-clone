import { AppContext } from "../../context/AppContext";
import { useContext, useState, useEffect } from "react";

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";

import { db } from "../../servicios/firebase";

function Chat() {

  const { state } = useContext(AppContext);

  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [enviando, setEnviando] = useState(false);

  const usuario = state.user;
  const chatSeleccionado = state.selectedChat;

  // ID único de conversación

const otroUsuarioId = chatSeleccionado?.uid || chatSeleccionado?.id;

const chatId =
  usuario?.uid && otroUsuarioId
    ? [usuario.uid, otroUsuarioId].sort().join("_")
    : null;



  // Escuchar mensajes
  useEffect(() => {

    if (!chatId) {
      setMensajes([]);
      return;
    }

    const mensajesRef = collection(
      db,
      "chats",
      chatId,
      "messages"
    );

    const q = query(
      mensajesRef,
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {

        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setMensajes(lista);

      },
      (error) => {
        console.error("Error al cargar mensajes:", error);
      }
    );

    return () => unsubscribe();

  }, [chatId]);

  // Enviar mensaje
  const enviarMensaje = async (e) => {

    e.preventDefault();

    if (!mensaje.trim() || !chatId || enviando) return;

    setEnviando(true);

    try {
        
         const texto = mensaje.trim();

          const chatRef = doc(db, "chats", chatId);

         const mensajesRef = collection(
          chatRef,
          "messages"
          );

             const nuevoMensaje = {
             senderId: usuario.uid,
             senderName: usuario.name,
            text: texto,
            createdAt: serverTimestamp()
             };

// Crear o actualizar información de la conversación
              await setDoc(chatRef, {
               participants: [usuario.uid, otroUsuarioId],
               lastMessage: texto,
               lastMessageSender: usuario.uid,
               lastMessageAt: serverTimestamp()
               }, { merge: true });

// Guardar el mensaje
              await addDoc(mensajesRef, nuevoMensaje);

              setMensaje("");

    /*  const mensajesRef = collection(
        db,
        "chats",
        chatId,
        "messages"
      );

      await addDoc(mensajesRef, {

        senderId: usuario.uid,

        senderName: usuario.name,

        text: mensaje.trim(),

        createdAt: serverTimestamp()

      });




      setMensaje("");

     */ 

    } catch (error) {

      console.error("Error al enviar:", error);

      alert("No se pudo enviar el mensaje");

    } finally {

      setEnviando(false);

    }

  };

  return (

    <div
      className="chat"
      style={{
        flex: 1,
        padding: "20px"
      }}
    >

      {chatSeleccionado ? (

        <>

          <h2>
            Chat con {chatSeleccionado.name}
          </h2>

          <div
            style={{
              minHeight: "350px",
              maxHeight: "450px",
              overflowY: "auto",
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px"
            }}
          >

            {mensajes.length === 0 ? (

              <p>No hay mensajes todavía</p>

            ) : (

              mensajes.map((msg) => (

                <div
                  key={msg.id}
                  style={{
                    marginBottom: "10px",
                    textAlign:
                      msg.senderId === usuario.uid
                        ? "right"
                        : "left"
                  }}
                >

                  <strong>
                    {msg.senderName}
                  </strong>

                  <p>{msg.text}</p>

                </div>

              ))

            )}

          </div>

          <form onSubmit={enviarMensaje}>

            <input
              type="text"
              value={mensaje}
              onChange={(e) =>
                setMensaje(e.target.value)
              }
              placeholder="Escribe un mensaje..."
              style={{
                width: "70%",
                padding: "10px"
              }}
            />

            <button
              type="submit"
              disabled={!mensaje.trim() || enviando}
              style={{
                marginLeft: "10px"
              }}
            >
              {enviando ? "Enviando..." : "Enviar"}
            </button>

          </form>

        </>

      ) : (

        <h2>Selecciona un chat</h2>

      )}

    </div>

  );

}

export default Chat;