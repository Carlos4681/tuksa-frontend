import { Link } from 'react-router-dom';
import { UsersIcon, HomeModernIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import './Home.css'; 

function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Panel de Control</h1>
        <p className="subtitulo">Gestión Integral Inmobiliaria</p>
      </header>

      <div className="cards-grid">
        {/* Clase card-clientes añadida */}
        <Link to="/clientes" className="card-link card-clientes">
          <div className="card-icon-container">
            <UsersIcon className="card-icon" />
          </div>
          <div className="card-content">
            <h3>Clientes</h3>
            <p>Administra clientes y contactos</p>
          </div>
        </Link>

        {/* Clase card-propiedades añadida */}
        <Link to="/propiedades" className="card-link card-propiedades">
          <div className="card-icon-container">
            <HomeModernIcon className="card-icon" />
          </div>
          <div className="card-content">
            <h3>Propiedades</h3>
            <p>Inventario de inmuebles disponibles.</p>
          </div>
        </Link>

        {/* Clase card-interacciones añadida */}
        <Link to="/interacciones" className="card-link card-interacciones">
          <div className="card-icon-container">
            <CalendarDaysIcon className="card-icon" />
          </div>
          <div className="card-content">
            <h3>Interacciones</h3>
            <p>Seguimiento de visitas y tareas.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Home;