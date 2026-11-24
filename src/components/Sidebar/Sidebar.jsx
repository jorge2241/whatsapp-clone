import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

function Sidebar() {

  const { state, dispatch } = useContext(AppContext);

  // Formatear hora del último mensaje
  const formatearHora = (fecha) => {

    if (!fecha) return "";

    const date = fecha.toDate
      ? fecha.toDate()
      : new Date(fecha);

    return date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit"
    });

  };

  return (

    <div style={{
      width: "300px",
      borderRight: "1px solid #ddd",
      padding: "15px"
    }}>

      <h2>Mis chats</h2>

      {state.chats?.map(usuario => (

        <div
          key={usuario.id || usuario.uid}

          onClick={() =>
            dispatch({
              type: "SELECT_CHAT",
              payload: usuario
            })
          }

          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px",
            marginBottom: "5px",
            cursor: "pointer",
            borderRadius: "8px",
            background:
              state.selectedChat?.id === usuario.id
                ? "#e9e9e9"
                : "transparent"
          }}
        >

          <img
            src={usuario.photo}
            alt={usuario.name}
            width="45"
            height="45"
            style={{
              borderRadius: "50%",
              objectFit: "cover"
            }}
          />

          <div style={{
            flex: 1,
            minWidth: 0
          }}>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "5px"
            }}>

              <strong>{usuario.name}</strong>

              <small style={{
                color: "#888",
                whiteSpace: "nowrap"
              }}>
                {formatearHora(usuario.lastMessageAt)}
              </small>

            </div>

            <p style={{
              margin: "5px 0 0",
              color: "#777",
              fontSize: "13px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis"
            }}>

             {usuario.lastMessage
  ? (
      usuario.lastMessageSender === state.user.uid
        ? 'Vos: ${usuario.lastMessage}'
        : usuario.lastMessage
    )
  : usuario.email
  }

            </p>

          </div>

        </div>

      ))}

    </div>

  );

}

export default Sidebar;