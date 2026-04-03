/**PropiedadItem.jsx (el hijo)
Este archivo representa a una sola propiedad.
Responsabilidades:
Mostrar los datos de la propiedad (título, dirección, precio, tipo, etc.).
Botón Editar → te redirige a la página de edición (/propiedades/editar/:id).
Botón Eliminar → abre un SweetAlert, llama al backend (DELETE /propiedades/:id) y si todo sale bien avisa al padre (onPropiedadEliminada). */


import React from 'react';
import './Propiedades.css';
import { Link } from 'react-router-dom';
import { Edit, X } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../config/axios";

const PropiedadItem = ({ propiedad, onPropiedadEliminada }) => {
  const {
    titulo,
    descripcion,
    tipo_inmueble,
    estado_inmueble,
    precio_venta,
    precio_alquiler,
    direccion,
    ciudad,
    habitaciones,
    sanitarios,
    fotos
  } = propiedad;

  // Función para formatear precio
  const formatearPrecio = (precio) => {
    if (!precio) return 'No especificado';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  // Función para mostrar precio según disponibilidad
  const mostrarPrecio = () => {
    if (precio_venta && precio_alquiler) {
      return `Venta: ${formatearPrecio(precio_venta)} | Alquiler: ${formatearPrecio(precio_alquiler)}`;
    } else if (precio_venta) {
      return `Venta: ${formatearPrecio(precio_venta)}`;
    } else if (precio_alquiler) {
      return `Alquiler: ${formatearPrecio(precio_alquiler)}`;
    }
    return 'Precio no especificado';
  };

  // Función para eliminar propiedad
  const eliminarPropiedad = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `Vas a eliminar la propiedad "${titulo}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/propiedades/${propiedad._id}`);
          Swal.fire({
            icon: "success",
            title: "Propiedad Eliminar",
            timer: 2000,
            showConfirmButton: false,
            width: '400px'
          });
          if (onPropiedadEliminada) {
            onPropiedadEliminada(propiedad._id);
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "No se pudo eliminar propiedad",
            timer: 2000,
            showConfirmButton: false,
            width: '400px'
          });
        }
      }
    });
  };

  return (
    <li className="propiedad">
      {/* GALERÍA DE IMÁGENES: Muestra todas las fotos o placeholder */}
      {fotos && fotos.length > 0 ? (
        <div className="propiedad-galeria">
          {fotos.map((foto, index) => (
            <img 
              key={index} 
              src={foto} // 🛠️ CAMBIO QUIRÚRGICO: Se usa la URL completa que viene del backend
              alt={`Imagen ${index + 1} de ${titulo}`}
              className="imagen-propiedad-galeria"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Error+al+cargar+imagen'; }}
            />
          ))}
        </div>
      ) : (
        // PLACEHOLDER: Cuando no hay fotos
        <div className="propiedad-imagen">
          <div className="imagen-placeholder">
            <span>📷</span>
            <p>Sin imagen</p>
          </div>
        </div>
      )}
      
      <div className="propiedad-contenido">
        <div className="info-propiedad">
          <p><span className="etiqueta">Título:</span> <span className="valor">{titulo}</span></p>
          <p><span className="etiqueta">Dirección:</span> <span className="valor">{direccion}</span></p>
          <p><span className="etiqueta">Ciudad:</span> <span className="valor">{ciudad}</span></p>
          <p><span className="etiqueta">Tipo:</span> <span className="valor">{tipo_inmueble || 'No especificado'}</span></p>
          <p>
            <span className="etiqueta">Estado:</span>
            <span className={`valor estado ${estado_inmueble ? estado_inmueble.toLowerCase() : 'disponible'}`}>
              {estado_inmueble || 'Disponible'}
            </span>
          </p>
          <p><span className="etiqueta">Precio:</span> <span className="valor">{mostrarPrecio()}</span></p>
          {habitaciones > 0 && <p><span className="etiqueta">Habitaciones:</span> <span className="valor">{habitaciones}</span></p>}
          {sanitarios > 0 && <p><span className="etiqueta">Sanitarios:</span> <span className="valor">{sanitarios}</span></p>}
          {descripcion && <p><span className="etiqueta">Descripción:</span> <span className="valor">{descripcion}</span></p>}
        </div>

        <div className="acciones">
          <Link to={`/propiedades/editar/${propiedad._id}`} className="btn btn-azul">
            <Edit size={16} style={{ marginRight: "6px" }} />
            Editar
          </Link>
          <button 
            type="button" 
            className="btn btn-rojo btn-eliminar"
            onClick={eliminarPropiedad}
          >
            <X size={16} style={{ marginRight: "6px" }} />
            Eliminar
          </button>
        </div>
      </div>
    </li>
  );
};

export default PropiedadItem;