import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const login = () => {
    navigate("/chat");
  };

  return (
    <div>
      <h1>WhatsApp Clone</h1>

      <button onClick={login}>
        Iniciar sesión
      </button>
    </div>
  );
}

export default Login;