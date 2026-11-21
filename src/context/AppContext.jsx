import { createContext, useReducer } from "react";
import { appReducer } from "./AppReducer";

export const AppContext = createContext();

const initialState = {
  user: null,
  chats: [],
  selectedChat: null
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    appReducer,
    initialState
  );

  return (
    <AppContext.Provider
      value={{ state, dispatch }}
    >
      {children}
    </AppContext.Provider>
  );
};