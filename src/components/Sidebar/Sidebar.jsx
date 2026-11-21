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