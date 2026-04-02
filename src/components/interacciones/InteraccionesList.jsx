import React, { useState, useEffect } from "react";
import api from "../../config/axios";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react"; // ✅ Eliminado Users
import Spinner from "../layout/Spinner";
import InteraccionItem from "./InteraccionItem"; 
import "./Interacciones.css"; // ✅ Asegúrate de tener este CSS

function Interacciones() {
  // -------------------------------------------------------------------
  // 1. ESTADOS PRINCIPALES
  // -------------------------------------------------------------------
  const [interacciones, setInteracciones] = useState([]);
  const [interaccionesFiltradas, setInteraccionesFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  // -------------------------------------------------------------------
  // 2. CARGA DE DATOS
  // -------------------------------------------------------------------
  const consultarInteracciones = async () => {
    setCargando(true);
    try {
      const res = await api.get("/interacciones");
      const data = res.data.interacciones || res.data;
      setInteracciones(data);
      setInteraccionesFiltradas(data); // ✅ Sincroniza la lista base
    } catch (error) {
      console.error("Error consultando interacciones:", error);
      setInteracciones([]);
      setInteraccionesFiltradas([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    consultarInteracciones();
  }, []);

  // -------------------------------------------------------------------
  // 3. HANDLERS
  // -------------------------------------------------------------------
  const handleRecarga = () => {
    consultarInteracciones();
  };

  // ✅ Búsqueda dinámica
  useEffect(() => {
    const texto = busqueda.toLowerCase();
    const filtradas = interacciones.filter(
      (i) =>
        i.cliente?.nombre?.toLowerCase().includes(texto) ||
        i.cliente?.apellido?.toLowerCase().includes(texto) ||
        i.tipo?.toLowerCase().includes(texto) ||
        i.resultado?.toLowerCase().includes(texto) ||
        i.propiedad?.titulo?.toLowerCase().includes(texto)
    );
    setInteraccionesFiltradas(filtradas);
  }, [busqueda, interacciones]);

  // -------------------------------------------------------------------
  // 4. RENDERIZADO
  // -------------------------------------------------------------------
  return (
    <div>
      <h2>Interacciones</h2>

      {/* ✅ Buscador con ícono de lupa */}
      <div className="buscador-container">
        <Search size={18} className="icono-buscar" />
        <input
          type="text"
          placeholder="Buscar por cliente, tipo, resultado o propiedad..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input-buscar"
        />
      </div>

      <hr className="divider" />

      {/* --- Botón de Nueva Interacción --- */}
      <div className="header-interacciones">
        <Link to="/clientes" className="btn-agregar-interaccion">
          <Plus size={18} /> Registrar Interacción de Clientes
        </Link>
      </div>

      {/* --- LISTADO DE INTERACCIONES --- */}
      {cargando ? (
        <Spinner />
      ) : (
        <>
          {interaccionesFiltradas.length === 0 ? (
            <div className="no-interacciones">
              <p>No hay interacciones registradas todavía.</p>
            </div>
          ) : (
            <ul className="listado-interacciones">
              {interaccionesFiltradas.map((interaccion) => (
                <InteraccionItem
                  key={interaccion._id}
                  interaccion={interaccion}
                  onInteraccionActualizada={handleRecarga}
                />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default Interacciones;
