import { createContext, useReducer, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../servicios/firebase";
import { doc, setDoc } from "firebase/firestore";
import { appReducer } from "./AppReducer";

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

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {

  const [state, dispatch] = useReducer(appReducer, initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

      if (firebaseUser) {

        const usuario = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || "",
          email: firebaseUser.email || "",
          photo: firebaseUser.photoURL || ""
        };

        try {
          await setDoc(
            doc(db, "users", firebaseUser.uid),
            usuario,
            { merge: true }
          );
        } catch (error) {
          console.error("Error al actualizar usuario:", error);
        }

        dispatch({
          type: "LOGIN",
          payload: usuario
        });

      } else {

        dispatch({
          type: "LOGOUT"
        });

      }

      setLoading(false);
    });

    return () => unsubscribe();

  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, loading }}>
      {children}
    </AppContext.Provider>
  );
};