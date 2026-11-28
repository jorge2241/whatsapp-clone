import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../servicios/firebase";

import { useNavigate } from "react-router-dom";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const loginGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();

      await signInWithPopup(auth, provider);

      // AppContext detectará automáticamente
      // el inicio de sesión mediante onAuthStateChanged.

      navigate("/chat");

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
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

        <button
          className="google-login"
          onClick={loginGoogle}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
          />

          Iniciar sesión con Google
        </button>

        <div className="login-footer">
          <p>Proyecto académico</p>

          <strong>
            Universidad Tecnológica Nacional (UTN)
          </strong>

          <span>
            Aplicación desarrollada con fines educativos.
          </span>
        </div>

      </div>

      <p className="login-copyright">
        WhatsApp Clone © 2026
      </p>

    </div>
  );
}

export default Login;