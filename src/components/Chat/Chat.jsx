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

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { db, storage } from "../../servicios/firebase";

function Chat() {
  const { state } = useContext(AppContext);

  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [imagen, setImagen] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState("");

  const usuario = state.user;
  const chatSeleccionado = state.selectedChat;

  const otroUsuarioId =
    chatSeleccionado?.uid || chatSeleccionado?.id;

  const chatId =
    usuario?.uid && otroUsuarioId
      ? [usuario.uid, otroUsuarioId].sort().join("_")
      : null;

  // Crear vista previa de la imagen
  useEffect(() => {
    if (!imagen) {
      setVistaPrevia("");
      return;
    }

    const url = URL.createObjectURL(imagen);
    setVistaPrevia(url);

    return () => URL.revokeObjectURL(url);
  }, [imagen]);

  // Escuchar mensajes en tiempo real
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
        const lista = snapshot.docs.map((documento) => ({
          id: documento.id,
          ...documento.data(),
        }));

        setMensajes(lista);
      },
      (error) => {
        console.error("Error al cargar mensajes:", error);
      }
    );

    return () => unsubscribe();
  }, [chatId]);

  // Seleccionar fotografía
  const seleccionarImagen = (e) => {
    const archivo = e.target.files?.[0];

    if (!archivo) return;

    if (!archivo.type.startsWith("image/")) {
      alert("Selecciona un archivo de imagen.");
      e.target.value = "";
      return;
    }

    if (archivo.size > 5 * 1024 * 1024) {
      alert("La imagen no puede superar los 5 MB.");
      e.target.value = "";
      return;
    }

    setImagen(archivo);
  };

  // Enviar mensaje o fotografía
  const enviarMensaje = async (e) => {
    e.preventDefault();

    if (!chatId || !usuario?.uid || enviando) return;

    const textos = mensaje.trim(); /* texto -> textos */

    if (!textos && !imagen) return;  /* texto -> textos */

    setEnviando(true);

    try {
      const chatRef = doc(db, "chats", chatId);

      const mensajesRef = collection(
        chatRef,
        "messages"
      );

      let nuevoMensaje;

      if (imagen) {
        // Subir imagen a Firebase Storage
      
      const nombreArchivo = '${Date.now()}_${imagen.name.replace(/[^a-zA-Z0-9._-]/g, "_")};'  /* puse comillas invertidas */

        const rutaImagen = ' chats/${chatId}/${nombreArchivo};'  /* puse comillas invertidas */

        const imagenRef = ref(storage, rutaImagen);

        await uploadBytes(imagenRef, imagen);

        const imageUrl = await getDownloadURL(imagenRef);

        nuevoMensaje = {
          senderId: usuario.uid,
          senderName: usuario.name || usuario.displayName || "Usuario",
          type: "image",
          imageUrl,
          fileName: imagen.name,
          text: texto,
          createdAt: serverTimestamp(),
        };
      } else {
        nuevoMensaje = {
          senderId: usuario.uid,
          senderName: usuario.name || usuario.displayName || "Usuario",
          type: "text",
          text: texto,
          createdAt: serverTimestamp(),
        };
      }

      const ultimoMensaje = imagen
        ? texto
          ?  '📷 ${texto}' 
          : "📷 Imagen"
        : texto;

      // Actualizar información de la conversación
      await setDoc(
        chatRef,
        {
          participants: [usuario.uid, otroUsuarioId],
          lastMessage: ultimoMensaje,
          lastMessageSender: usuario.uid,
          lastMessageAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Guardar mensaje en Firestore
      await addDoc(mensajesRef, nuevoMensaje);

      setMensaje("");
      setImagen(null);

      const inputImagen = document.getElementById(
        "chat-image-input"
      );

      if (inputImagen) {
        inputImagen.value = "";
      }

    } catch (error) {
      console.error("Error al enviar:", error);

      alert(
        "No se pudo enviar el mensaje. Comprueba Firebase Storage y sus permisos."
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      className="chat"
      style={{
        flex: 1,
        padding: "20px",
      }}
    >
      {chatSeleccionado ? (
        <>
          <h2>
            Chat con {chatSeleccionado.name}
          </h2>

          {/* Lista de mensajes */}
          <div
            style={{
              minHeight: "350px",
              maxHeight: "450px",
              overflowY: "auto",
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            {mensajes.length === 0 ? (
              <p>No hay mensajes todavía</p>
            ) : (
              mensajes.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    marginBottom: "15px",
                    textAlign:
                      msg.senderId === usuario.uid
                        ? "right"
                        : "left",
                  }}
                >
                  <strong>
                    {msg.senderName}
                  </strong>

                  {/* Mostrar fotografía */}
                  {msg.type === "image" && msg.imageUrl && (
                    <div>
                      <a
                        href={msg.imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={msg.imageUrl}
                          alt="Imagen enviada"
                          loading="lazy"
                          style={{
                            display: "block",
                            maxWidth: "220px",
                            maxHeight: "250px",
                            objectFit: "contain",
                            borderRadius: "10px",
                            marginTop: "5px",
                            marginLeft:
                              msg.senderId === usuario.uid
                                ? "auto"
                                : "0",
                          }}
                        />
                      </a>
                    </div>
                  )}

                  {/* Mostrar texto */}
                  {msg.text && (
                    <p>{msg.text}</p>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Vista previa */}
          {vistaPrevia && (
            <div
              style={{
                marginBottom: "10px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                display: "inline-block",
              }}
            >
              <img
                src={vistaPrevia}
                alt="Vista previa"
                style={{
                  maxWidth: "150px",
                  maxHeight: "150px",
                  objectFit: "contain",
                  display: "block",
                }}
              />

              <button
                type="button"
                onClick={() => setImagen(null)}
                style={{ marginTop: "8px" }}
              >
                Quitar imagen
              </button>
            </div>
          )}

          {/* Formulario */}
          <form
            onSubmit={enviarMensaje}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            {/* Botón para seleccionar imagen */}
            <label
              htmlFor="chat-image-input"
              style={{
                cursor: "pointer",
                fontSize: "24px",
                padding: "5px",
              }}
              title="Adjuntar imagen"
            >
              📎
            </label>

            <input
              id="chat-image-input"
              type="file"
              accept="image/*"
              onChange={seleccionarImagen}
              disabled={enviando}
              style={{ display: "none" }}
            />

            <input
              type="text"
              value={mensaje}
              onChange={(e) =>
                setMensaje(e.target.value)
              }
              placeholder="Escribe un mensaje..."
              style={{
                flex: 1,
                minWidth: "120px",
                padding: "10px",
              }}
            />

            <button
              type="submit"
              disabled={
                (!mensaje.trim() && !imagen) || enviando
              }
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