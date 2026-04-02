import React, { useState, useEffect, useContext } from "react";
import api from "../../config/axios";
import { Link, useNavigate } from "react-router-dom"; // Añadimos useNavigate para proteger la ruta
import { UserPlus, Search } from "lucide-react";
import "./Clientes.css";
import Spinner from "../layout/Spinner";
import ClienteItem from "./ClienteItem";
import { CRMContext } from "../../contex/CRMcontext";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  // 1. Extraemos los 3 valores: el estado, la función y el semáforo de carga
  const [auth, guardarAuth, cargandoContext] = useContext(CRMContext);
  
  const navigate = useNavigate();

  useEffect(() => {
    // 2. Si el Context todavía está leyendo el localStorage, no hacemos nada
    if (cargandoContext) return;

    // 3. Si ya terminó de cargar y NO hay auth, lo mandamos al login
    if (!auth.auth) {
      navigate('/iniciar-sesion');
      return;
    }

    // 4. Si hay auth, definimos y ejecutamos la consulta
    const consultarAPI = async () => {
      try {
        const respuesta = await api.get("/clientes");
        setClientes(respuesta.data);
        setCargando(false);
      } catch (error) {
        console.error("Error consultando clientes:", error);
        setCargando(false);
      }
    };

    consultarAPI();

  }, [auth, cargandoContext, navigate]); // Vigilamos auth y el cargandoContext

  const handleClienteEliminado = (idEliminado) => {
    setClientes(clientes.filter(c => c._id !== idEliminado));
  };

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // 5. Mientras el Context verifica la sesión, mostramos el Spinner general
  if (cargandoContext) return <Spinner />;

  return (
    <div>
      <div className="header-clientes">
        <h2>Clientes</h2>
        <Link to="/clientes/nuevo-cliente" className="btn-agregar-cliente">
          <UserPlus size={18} />
          Agregar Nuevo Cliente
        </Link>
      </div>

      <div className="buscador-clientes">
        <Search size={18} className="icono-busqueda" />
        <input
          type="text"
          placeholder="Buscar por nombre, correo o teléfono..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {cargando ? (
        <Spinner />
      ) : (
        <ul className="listado-clientes">
          {clientesFiltrados.length > 0 ? (
            clientesFiltrados.map((cliente) => (
              <ClienteItem
                key={cliente._id}
                cliente={cliente}
                onClienteEliminado={handleClienteEliminado}
              />
            ))
          ) : (
            <p>No se encontraron clientes.</p>
          )}
        </ul>
      )}
    </div>
  );
}

export default Clientes;