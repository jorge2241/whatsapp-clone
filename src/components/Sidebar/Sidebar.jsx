import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

function Sidebar() {

  const { state, dispatch } = useContext(AppContext);

  return (
    <div>

      {state.chats?.map(usuario => (

        <div
          key={usuario.uid}
          onClick={() =>
            dispatch({
              type: "SELECT_CHAT",
              payload: usuario
            })
          }
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "10px",
            cursor: "pointer"
          }}
        >
          <img
            src={usuario.photo}
            alt={usuario.name}
            width="40"
          />

          <div>
            <span>{usuario.name}</span>

            <p>{usuario.email}</p>
          </div>

        </div>

      ))}

    </div>
  );
}

export default Sidebar;