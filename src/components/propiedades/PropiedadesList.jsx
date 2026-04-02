/*PropiedadesList.jsx (el padre)
Es el contenedor principal de la sección de propiedades.
Responsabilidades:
- Hace la petición al backend (GET /propiedades) para traer todas las propiedades.
- Guarda esos datos en un useState.
- Recorre la lista de propiedades con .map() y por cada una renderiza un <PropiedadItem />.
- Tiene la función que elimina una propiedad de la lista en memoria (cuando PropiedadItem avisa que se borró en el servidor).
*/

import React, { useState, useEffect } from "react"; // Importamos React y los hooks useState y useEffect
import api from "../../config/axios"; // Importamos la instancia configurada de axios
import { Link } from "react-router-dom"
import { Plus, Search } from "lucide-react"; // Ícono para agregar propiedad
import "./Propiedades.css"; //importar estilos de propiedades
import Spinner from "../layout/Spinner"

//importar componente de propiedades
import PropiedadItem from "./PropiedadItem";

function Propiedades() {
  // Estado que guarda la lista de propiedades obtenidas desde la API
  const [propiedades, setPropiedades] = useState([]);
  // Estado que indica si todavía estamos cargando datos
  const [cargando, setCargando] = useState(true);
  //Nuevo estado para controlar el texto que el usuario escribe en el buscador
  const [busqueda, setBusqueda] = useState("");

  // Función que consulta la API para obtener la lista de propiedades
  const consultarAPI = async () => {
    try {
      // Llamamos al endpoint /propiedades y esperamos la respuesta
      const propiedadesConsulta = await api.get("/propiedades");
      
      // Guardamos los datos de las propiedades en el estado
      setPropiedades(propiedadesConsulta.data);
      
      // Cambiamos el estado de carga a falso porque ya tenemos los datos
      setCargando(false);
    } catch (error) {
      // Si hay un error al consultar la API lo mostramos en consola
      console.error("Error consultando propiedades:", error);
      
      // También detenemos el estado de carga
      setCargando(false);
    }
  };
  
  // useEffect para ejecutar la consulta cuando se monte el componente
  useEffect(() => {
    consultarAPI(); // Llama a la función solo una vez al inicio
  }, []); // El array vacío [] significa que se ejecuta solo al montar
  
  // Función que elimina una propiedad del estado cuando el hijo avisa que fue eliminada
  const handlePropiedadEliminada = (idEliminado) => {
    // Filtramos las propiedades quitando la que tenga ese _id
    setPropiedades(propiedades.filter(p => p._id !== idEliminado));
  };

  // 🟢 Nueva constante: propiedades filtradas según el texto ingresado
  const propiedadesFiltradas = propiedades.filter((p) => { 
    const termino = busqueda.toLowerCase();               
    return (                                              
      p.titulo?.toLowerCase().includes(termino) ||        
      p.direccion?.toLowerCase().includes(termino) ||    
      p.ciudad?.toLowerCase().includes(termino)           
    );                                                    
  });                                                     

  
  return (
    <div>
      {/* Encabezado con el título y el botón para agregar propiedades */}
      <div className="header-propiedades">
        <h2>Propiedades</h2>
        <Link to="/propiedades/nueva-propiedad" className="btn-agregar-propiedad">
          {/* Ícono de "agregar" */}
          <Plus size={18} />
          Agregar Nueva Propiedad
        </Link>
      </div>

      {/* 🔎 Campo de búsqueda agregado */}
      <input                                           
        type="text"                                   
        placeholder="Buscar por título, dirección o ciudad..." 
        className="input-busqueda"                    
        value={busqueda}                              
        onChange={(e) => setBusqueda(e.target.value)} 
      />          
      
      {/* Si estamos cargando mostramos un texto */}
      {cargando ? (
         <Spinner /> // 👈 Muestra spinner en vez de texto
      ) : (
        // Si ya cargamos, mostramos la lista de propiedades
        <ul className="listado-propiedades">
          {/* Recorremos el array de propiedades y renderizamos un PropiedadItem por cada una */}
          {propiedadesFiltradas.map((propiedad) => (
            <PropiedadItem 
              key={propiedad._id} // clave única que React necesita
              propiedad={propiedad} // Pasamos los datos de la propiedad al hijo
              onPropiedadEliminada={handlePropiedadEliminada} // Pasamos la función para que el hijo avise al eliminar
            />
          ))}
        </ul>
      )}
    </div>
  );
}

// Exportamos el componente para usarlo en otras partes de la app
export default Propiedades;