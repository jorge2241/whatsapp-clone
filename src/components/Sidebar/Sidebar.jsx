import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

function Sidebar() {

  const { state, dispatch } = useContext(AppContext);

  return (
    <div>

      {state.chats.map(usuario => (

        <div
          key={usuario.uid}
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "10px"
          }}
        >
          <img
            src={usuario.photo}
            alt={usuario.name}
            width="40"
          />

          <span>
            {usuario.name}
          </span>

        </div>

      ))}

    </div>
  );
}

export default Sidebar;

/*

  import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

function Sidebar() {

  const { state, dispatch } =
    useContext(AppContext);

  return (
    <div className="sidebar">

      {state.chats.map(chat => (
        <div
          key={chat.id}
          onClick={() =>
            dispatch({
              type: "SELECT_CHAT",
              payload: chat
            })
          }
        >
          {chat.name}
        </div>
      ))}

    </div>
  );
}

export default Sidebar;

*/