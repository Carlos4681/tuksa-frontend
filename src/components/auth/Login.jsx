//login.jsx
import React, { useState, useContext } from "react";
import "./Login.css"
import Swal from "sweetalert2";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { CRMContext } from "../../contex/CRMcontext";

function Login() {

  const navigate = useNavigate();
  const [auth, guardarAuth] = useContext(CRMContext);

  const [datos, setDatos] = useState({
    email: "",
    password: ""
  });

  const iniciarSesion = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post('/iniciar-sesion', datos);

      // GUARDAR TOKEN
      localStorage.setItem('token', data.token);

      // ACTUALIZAR CONTEXT
      guardarAuth({
        token: data.token,
        auth: true
      });

      Swal.fire({
        icon: 'success',
        title: 'Login correcto'
      });

      navigate('/clientes');

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.msg || 'Error'
      });
    }
  };

  const leerDatos = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value
    });
  };

 return (
  <div className="login-container">
    <div className="login-box">
      <h2>Iniciar Sesión</h2>

      <form onSubmit={iniciarSesion}>
        <input
          name="email"
          placeholder="Email"
          onChange={leerDatos}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={leerDatos}
        />

        <input
          type="submit"
          value="Iniciar Sesión"
          className="btn"
        />
      </form>
    </div>
  </div>
);
}

export default Login;