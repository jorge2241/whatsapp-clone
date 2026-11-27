import { createContext, useReducer } from "react";
import { appReducer } from "./AppReducer";

// Estado inicial de la aplicación
const initialState = {
  user: {
    uid: "",
    name: "",
    email: "",
    photo: ""
  },
  chats: [],
  selectedChat: null
};

// Crear contexto global
export const AppContext = createContext(null);

// Proveedor del contexto
export const AppProvider = ({ children }) => {

  const [state, dispatch] = useReducer(
    appReducer,
    initialState
  );

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};