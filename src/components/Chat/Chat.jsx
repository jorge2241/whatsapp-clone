import { AppContext } from "../../context/AppContext";
import { useContext, useState, useEffect, useRef } from "react";

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

  const mensajesFinalRef = useRef(null);

  const usuario = state.user;
  const chatSeleccionado = state.selectedChat;

  const otroUsuarioId =
    chatSeleccionado?.uid || chatSeleccionado?.id;

  const chatId =
    usuario?.uid && otroUsuarioId
      ? [usuario.uid, otroUsuarioId].sort().join("_")
      : null;

  const nombreContacto =
    chatSeleccionado?.name || "Usuario";

  const inicial = nombreContacto.charAt(0).toUpperCase();

  // Vista previa de imagen
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

  // Bajar automáticamente al último mensaje
  useEffect(() => {
    mensajesFinalRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [mensajes]);

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

  // Formato de hora
  const obtenerHora = (fecha) => {
    if (!fecha) return "";

    const date = fecha.toDate
      ? fecha.toDate()
      : new Date(fecha);

    if (isNaN(date.getTime())) return "";

    return date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Enviar mensaje
  const enviarMensaje = async (e) => {
    e.preventDefault();

    if (!chatId || !usuario?.uid || enviando) return;

    const texto = mensaje.trim();

    if (!texto && !imagen) return;

    setEnviando(true);

    try {
      const chatRef = doc(db, "chats", chatId);

      const mensajesRef = collection(
        chatRef,
        "messages"
      );

      let nuevoMensaje;

      if (imagen) {

        /* hay que poner commillas invertidas        */ 
        const nombreArchivo =
          '${Date.now()}_${imagen.name.replace(/[^a-zA-Z0-9._-]/g, "_")}';

        /* hay que poner commillas invertidas        */ 
        const rutaImagen =
          chats/'${chatId}/${nombreArchivo}';

        const imagenRef = ref(storage, rutaImagen);

        await uploadBytes(imagenRef, imagen);

        const imageUrl = await getDownloadURL(imagenRef);

        nuevoMensaje = {
          senderId: usuario.uid,
          senderName:
            usuario.name || usuario.displayName || "Usuario",
          type: "image",
          imageUrl,
          fileName: imagen.name,
          text: texto,
          createdAt: serverTimestamp(),
        };
      } else {
        nuevoMensaje = {
          senderId: usuario.uid,
          senderName:
            usuario.name || usuario.displayName || "Usuario",
          type: "text",
          text: texto,
          createdAt: serverTimestamp(),
        };
      }
/* hay que poner commillas invertidas   ''´´     */ 
      const ultimoMensaje = imagen
        ? texto
          ? '📷 ${texto}'
          : "📷 Imagen"
        : texto;

      await setDoc(
        chatRef,
        {
          participants: [usuario.uid, otroUsuarioId].sort(),
          lastMessage: ultimoMensaje,
          lastMessageSender: usuario.uid,
          lastMessageAt: serverTimestamp(),
        },
        { merge: true }
      );

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
      console.error("Error real al enviar:", error);

      alert(
        "No se pudo enviar el mensaje. Revisa la consola para conocer el error."
      );
    } finally {
      setEnviando(false);
    }
  };

  const estilos = {
    contenedor: {
      display: "flex",
      flexDirection: "column",
     // height: "calc(100vh - 40px)",
     // minHeight: "450px",

      height: "100%",
      minHeight: 0,
      width: "100%",
      borderRadius: 0,
      boxShadow: "none",

      background: "#efeae2",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 3px 15px rgba(0,0,0,0.12)",
    },

    cabecera: {
      background: "#075e54",
      color: "white",
      padding: "14px 20px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },

    avatar: {
      width: "44px",
      height: "44px",
      borderRadius: "50%",
      background: "#d9fdd3",
      color: "#075e54",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
      fontWeight: "bold",
    },

    zonaMensajes: {
      flex: 1,
      overflowY: "auto",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      backgroundColor: "#efeae2",
      backgroundImage:
        "radial-gradient(rgba(120,100,80,0.08) 1px, transparent 1px)",
      backgroundSize: "20px 20px",
    },

    burbujaBase: {
      maxWidth: "75%",
      minWidth: "70px",
      padding: "9px 12px 6px",
      borderRadius: "10px",
      boxShadow: "0 1px 2px rgba(0,0,0,0.12)",
      overflowWrap: "anywhere",
    },

    formulario: {
      background: "#f0f2f5",
      padding: "12px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },

    entrada: {
      flex: 1,
      minWidth: 0,
      border: "none",
      outline: "none",
      borderRadius: "25px",
      padding: "13px 18px",
      fontSize: "15px",
      background: "white",
    },

    botonEnviar: {
      border: "none",
      borderRadius: "50%",
      width: "45px",
      height: "45px",
      background: "#075e54",
      color: "white",
      fontSize: "20px",
      cursor: "pointer",
    },
  };

  return (
    <div style={estilos.contenedor}>

      {chatSeleccionado ? (
        <>
          {/* CABECERA */}
          <header style={estilos.cabecera}>
            <div style={estilos.avatar}>
              {inicial}
            </div>

            <div>
              <div style={{ fontWeight: "bold", fontSize: "16px" }}>
                {nombreContacto}
              </div>

              <div style={{ fontSize: "12px", opacity: 0.85 }}>
                Conversación privada
              </div>
            </div>
          </header>

          {/* MENSAJES */}
          <div style={estilos.zonaMensajes}>

            {mensajes.length === 0 && (
              <div style={{
                textAlign: "center",
                margin: "auto",
                background: "#fff",
                padding: "15px 20px",
                borderRadius: "10px",
                color: "#667781",
                fontSize: "14px",
              }}>
                ¡Comienza la conversación!
              </div>
            )}

            {mensajes.map((msg) => {
              const esMio = msg.senderId === usuario.uid;

              return (
                <div
                  key={msg.id}
                  style={{
                    display: "flex",
                    justifyContent: esMio
                      ? "flex-end"
                      : "flex-start",
                  }}
                >
                  <div
                    style={{
                      ...estilos.burbujaBase,
                      background: esMio ? "#d9fdd3" : "#ffffff",
                      borderTopRightRadius: esMio ? "3px" : "10px",
                      borderTopLeftRadius: esMio ? "10px" : "3px",
                    }}
                  >
                    {!esMio && (
                      <div style={{
                        fontSize: "12px",
                        color: "#075e54",
                        fontWeight: "bold",
                        marginBottom: "4px",
                      }}>
                        {msg.senderName}
                      </div>
                    )}

                    {msg.type === "image" && msg.imageUrl && (
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
                            width: "100%",
                            maxWidth: "250px",
                            maxHeight: "280px",
                            objectFit: "contain",
                            borderRadius: "8px",
                            marginBottom: "5px",
                          }}
                        />
                      </a>
                    )}

                    {msg.text && (
                      <div style={{
                        fontSize: "15px",
                        color: "#111b21",
                        lineHeight: "1.45",
                        whiteSpace: "pre-wrap",
                      }}>
                        {msg.text}
                      </div>
                    )}

                    <div style={{
                      fontSize: "10px",
                      color: "#667781",
                      textAlign: "right",
                      marginTop: "4px",
                    }}>
                      {obtenerHora(msg.createdAt)}
                      {esMio && (
                        <span style={{
                          color: "#53a7c5",
                          marginLeft: "5px",
                          fontSize: "13px",
                        }}>
                          ✓✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={mensajesFinalRef} />
          </div>

          {/* VISTA PREVIA DE IMAGEN */}
          {vistaPrevia && (
            <div style={{
              background: "#f0f2f5",
              padding: "10px 15px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}>
              <img
                src={vistaPrevia}
                alt="Vista previa"
                style={{
                  width: "65px",
                  height: "65px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />

              <button
                type="button"
                onClick={() => {
                  setImagen(null);
                  const input = document.getElementById("chat-image-input");
                  if (input) input.value = "";
                }}
                style={{
                  border: "none",
                  background: "#e4e6eb",
                  borderRadius: "20px",
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
              >
                Quitar imagen ✕
              </button>
            </div>
          )}

          {/* FORMULARIO */}
          <form
            onSubmit={enviarMensaje}
            style={estilos.formulario}
          >
            <label
              htmlFor="chat-image-input"
              title="Adjuntar fotografía"
              style={{
                fontSize: "25px",
                cursor: "pointer",
                color: "#54656f",
                padding: "5px",
              }}
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
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escribe un mensaje..."
              style={estilos.entrada}
              disabled={enviando}
            />

            <button
              type="submit"
              disabled={(!mensaje.trim() && !imagen) || enviando}
              style={{
                ...estilos.botonEnviar,
                opacity: (!mensaje.trim() && !imagen) || enviando
                  ? 0.5
                  : 1,
              }}
              title="Enviar mensaje"
            >
              ➤
            </button>
          </form>
        </>
      ) : (
        <div style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#667781",
          flexDirection: "column",
          gap: "12px",
        }}>
          <div style={{ fontSize: "65px" }}>💬</div>
          <h2>Selecciona un chat</h2>
          <p>Elige un contacto para comenzar a conversar.</p>
        </div>
      )}
    </div>
  );
}

export default Chat;

