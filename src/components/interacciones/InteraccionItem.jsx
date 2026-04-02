import React from 'react';
//import './Interacciones.css';
import { Link } from 'react-router-dom';
import { Edit, X, Eye, CheckCircle, Clock } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../config/axios";

const InteraccionItem = ({ interaccion, onInteraccionEliminada, onInteraccionActualizada }) => {
  const {
    tipo,
    fechaHora,
    descripcion,
    resultado,
    cliente,
    propiedad,
    fechaVencimiento,
    completada
  } = interaccion;

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return 'No especificada';
    const date = new Date(fecha);
    return date.toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para eliminar interacción
  const eliminarInteraccion = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `Vas a eliminar esta ${tipo.toLowerCase()} con ${cliente?.nombre || 'el cliente'}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/interacciones/${interaccion._id}`);
          Swal.fire({
            icon: "success",
            title: "Interacción Eliminada",
            timer: 2000,
            showConfirmButton: false,
            width: '400px'
          });

          // Avisamos al padre para que quite la interacción de la lista
          if (onInteraccionEliminada) {
            onInteraccionEliminada(interaccion._id);
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "No se pudo eliminar la interacción",
            timer: 2000,
            showConfirmButton: false,
            width: '400px'
          });
        }
      }
    });
  };

  // Función para actualizar el resultado de la interacción
  const actualizarResultado = async () => {
    const { value: nuevoResultado } = await Swal.fire({
      title: 'Actualizar Resultado',
      input: 'select',
      inputOptions: {
        'Exitosa': 'Exitosa',
        'No contesta': 'No contesta',
        'Pendiente': 'Pendiente',
        'Cancelada': 'Cancelada',
        'Reprogramada': 'Reprogramada'
      },
      inputValue: resultado,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      inputValidator: (value) => {
        if (!value) {
          return 'Debes seleccionar un resultado';
        }
      }
    });

    if (nuevoResultado) {
      try {
        await api.put(`/interacciones/${interaccion._id}`, { resultado: nuevoResultado });
        Swal.fire({
          icon: 'success',
          title: 'Resultado Actualizado',
          timer: 2000,
          showConfirmButton: false,
          width: '400px'
        });

        // Avisar al padre para que actualice la lista
        if (onInteraccionActualizada) {
          onInteraccionActualizada();
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo actualizar',
          timer: 2000,
          showConfirmButton: false,
          width: '400px'
        });
      }
    }
  };

  // Función para marcar tarea como completada/incompleta
  const toggleCompletada = async () => {
    try {
      await api.put(`/interacciones/${interaccion._id}`, { 
        completada: !completada 
      });
      
      Swal.fire({
        icon: 'success',
        title: completada ? 'Tarea marcada como pendiente' : 'Tarea completada',
        timer: 2000,
        showConfirmButton: false,
        width: '400px'
      });

      if (onInteraccionActualizada) {
        onInteraccionActualizada();
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo actualizar la tarea',
        timer: 2000,
        showConfirmButton: false,
        width: '400px'
      });
    }
  };

  return (
    <li className="interaccion">
      <div className="info-interaccion">
        {/* Encabezado con tipo y estado */}
        <div className="interaccion-header">
          <span className={`tipo-badge ${tipo.toLowerCase()}`}>
            {tipo}
          </span>
          {tipo === 'Tarea' && (
            <span className={`tarea-estado ${completada ? 'completada' : 'pendiente'}`}>
              {completada ? (
                <>
                  <CheckCircle size={14} style={{ marginRight: '4px' }} />
                  Completada
                </>
              ) : (
                <>
                  <Clock size={14} style={{ marginRight: '4px' }} />
                  Pendiente
                </>
              )}
            </span>
          )}
        </div>

        {/* Información principal */}
        <p>
          <span className="etiqueta">Cliente:</span>{' '}
          <span className="valor">{cliente?.nombre} {cliente?.apellido}</span>
        </p>

        {propiedad && (
          <p>
            <span className="etiqueta">Propiedad:</span>{' '}
            <span className="valor">{propiedad.titulo}</span>
          </p>
        )}

        <p>
          <span className="etiqueta">Fecha:</span>{' '}
          <span className="valor">{formatearFecha(fechaHora)}</span>
        </p>

        {tipo === 'Tarea' && fechaVencimiento && (
          <p>
            <span className="etiqueta">Vencimiento:</span>{' '}
            <span className="valor">{formatearFecha(fechaVencimiento)}</span>
          </p>
        )}

        <p>
          <span className="etiqueta">Resultado:</span>{' '}
          <span className={`valor resultado ${resultado?.toLowerCase().replace(' ', '-')}`}>
            {resultado}
          </span>
        </p>

        {descripcion && (
          <p>
            <span className="etiqueta">Descripción:</span>{' '}
            <span className="valor">{descripcion}</span>
          </p>
        )}
      </div>

      <div className="acciones">
        <Link 
          to={`/interacciones/editar/${interaccion._id}`} 
          className="btn btn-azul"
        >
          <Edit size={12} style={{ marginRight: "5px" }} />
          Editar
        </Link>

        <button 
          type="button" 
          className="btn btn-verde"
          onClick={actualizarResultado}
        >
          <Eye size={12} style={{ marginRight: "5px" }} />
          Actualizar Resultado
        </button>

        {tipo === 'Tarea' && (
          <button 
            type="button" 
            className={`btn ${completada ? 'btn-gris' : 'btn-morado'}`}
            onClick={toggleCompletada}
          >
            <CheckCircle size={12} style={{ marginRight: "5px" }} />
            {completada ? 'Marcar Pendiente' : 'Completar Tarea'}
          </button>
        )}

        <button 
          type="button" 
          className="btn btn-rojo btn-eliminar"
          onClick={eliminarInteraccion}
        >
          <X size={15} style={{ marginRight: "5px" }} />
          Eliminar
        </button>
      </div>
    </li>
  );
};

export default InteraccionItem;