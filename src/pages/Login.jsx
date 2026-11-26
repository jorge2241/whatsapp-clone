import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";

import { auth,db } from "../servicios/firebase";

import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

import { doc, setDoc } from "firebase/firestore";


import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const { dispatch } = useContext(AppContext);

  const loginGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
        createdAt: new Date()
      });

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
    <div className="login-page">

      <div className="login-header">
        <div className="whatsapp-logo">
          <span>☎️</span>
        </div>
        <h1>WhatsApp Clone</h1>
      </div>

      <div className="login-card">

        <h2>¡Bienvenido!</h2>

        <p className="login-description">
          Conectate con tus amigos y familiares
          de una manera simple y rápida.
        </p>

        <button className="google-login" onClick={loginGoogle}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
          />
          Iniciar sesión con Google
        </button>

        <div className="login-footer">
          <p>Proyecto académico</p>
          <strong>Universidad Tecnológica Nacional (UTN)</strong>
          <span>Aplicación desarrollada con fines educativos.</span>
        </div>

      </div>

      <p className="login-copyright">
        WhatsApp Clone © 2026
      </p>

    </div>
  );
}

export default Login;