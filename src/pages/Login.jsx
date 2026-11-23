import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";

import { auth } from "../servicios/firebase";

import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

import { doc, setDoc } from "firebase/firestore";
import { db } from "../servicios/firebase";



function Login() {

  const navigate = useNavigate();

 const {dispatch}= useContext(AppContext)

 const loginGoogle = async () => {
  try {

    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);

await setDoc(
  doc(db, "users", result.user.uid),
  {
    uid: result.user.uid,
    name: result.user.displayName,
    email: result.user.email,
    photo: result.user.photoURL,
    createdAt: new Date()
  }
);

dispatch({
  type: "LOGIN",
  payload: {
    uid: result.user.uid,
    name: result.user.displayName,
    email: result.user.email,
    photo: result.user.photoURL
  }
});

navigate("/chat");

  } catch (error) {
    console.log(error);
  }
};

  return (
    <div>
      <h1>WhatsApp Clone</h1>

      <button onClick={loginGoogle}>
        Login con Google
      </button>
    </div>
  );
}

export default Login;