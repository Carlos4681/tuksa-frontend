import React, { useContext } from 'react';
import './Header.css';
import { CRMContext } from '../../contex/CRMcontext';
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [auth, guardarAuth] = useContext(CRMContext);

  const cerrarSesion = () => {
    guardarAuth({ token: '', auth: false });
    localStorage.removeItem('token');
    navigate('/iniciar-sesion');
  };

  return (
    <header className="barra">
      <div className="contenedor">
        <div className='contenido-barra'>

          {/* BLOQUE IZQUIERDA: Envuelve h1 y p */}
          <div className="textos-header">
            <h1>Tuksa CRM Inmobiliario</h1>
            <p>Conectamos hogares con personas</p>
          </div>

          {/* BLOQUE DERECHA: El botón */}
          {auth.auth ? (
            <button
              type="button"
              className='btn btn-rojo'
              onClick={cerrarSesion}
            >
              <i className='far fa-times-circle'></i>
              Cerrar Sesión
            </button>
          ) : null}

        </div>
      </div>
    </header>
  );
}

export default Header;