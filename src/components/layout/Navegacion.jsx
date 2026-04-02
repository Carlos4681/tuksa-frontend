import React, {useContext} from 'react';
import { Link } from 'react-router-dom'; 
import { Home, Users, Building2, MessageSquare, LogIn, LogOut, Lock} from "lucide-react"; // Íconos de lucide
import './Navegacion.css';
import { CRMContext } from '../../contex/CRMcontext';


const Navegacion = () => {
  const [auth, guardarAuth] = useContext(CRMContext)

  if(!auth.auth) return null;
  return (
    <aside className="sidebar col-3">
      <h2>Administración</h2>
      
      <nav className="navegacion">
        
        <Link to="/" className="home">
          <Home size={20} style={{ marginRight: '8px' }} />
          Inicio
        </Link>

        <Link to="/clientes" className="clientes">
          <Users size={20} style={{ marginRight: '8px' }} />
          Clientes
        </Link>

        <Link to="/propiedades" className="propiedades">
          <Building2 size={20} style={{ marginRight: '8px' }} />
          Propiedades
        </Link>

        <Link to="/interacciones" className="interacciones">
          <MessageSquare size={20} style={{ marginRight: '8px' }} />
          Interacciones
        </Link>

      </nav>
    </aside>
  );
};

export default Navegacion;