/**ClienteItem.jsx (el hijo)
Este archivo representa a un solo cliente.
Responsabilidades:
Mostrar los datos del cliente (nombre, email, teléfono, etc.).
Botón Editar → te redirige a la página de edición (/clientes/editar/:id).
Botón Eliminar → abre un SweetAlert, llama al backend (DELETE /clientes/:id) y si todo sale bien avisa al padre (onClienteEliminado). */

import React from 'react';
import './Clientes.css';
import { Link } from 'react-router-dom';
import { Edit, X, Activity, Handshake } from "lucide-react"; // íconos
import Swal from "sweetalert2";
import api from "../../config/axios";

const ClienteItem = ({ cliente, onClienteEliminado }) => {
  const {
    nombre,
    apellido,
    email,
    telefono,
    tipo_cliente,
    fuente,
    estado,
    observaciones
  } = cliente;

  // Función para eliminar cliente
  const eliminarCliente = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `Vas a eliminar al cliente ${nombre} ${apellido}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/clientes/${cliente._id}`);
          Swal.fire({
            icon: "success",
            title: "Cliente Eliminado",
            timer: 2000,
            showConfirmButton: false,
            width: '400px'
          });

          //  Avisamos al padre para que quite el cliente de la lista
          if (onClienteEliminado) {
            onClienteEliminado(cliente._id);
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "No se pudo eliminar cliente",
            timer: 2000,
            showConfirmButton: false,
            width: '400px'
          });
        }
      }
    });
  };

  return (
    <li className="cliente">
      <div className="info-cliente">
        <p>
          <span className="etiqueta">Nombre:</span>{' '}
          <span className="valor">{nombre} {apellido}</span>
        </p>
        <p>
          <span className="etiqueta">Email:</span>{' '}
          <span className="valor">{email}</span>
        </p>
        <p>
          <span className="etiqueta">Teléfono:</span>{' '}
          <span className="valor">{telefono || 'No proporcionado'}</span>
        </p>
        <p>
          <span className="etiqueta">Tipo de Cliente:</span>{' '}
          <span className="valor">{tipo_cliente}</span>
        </p>
        <p>
          <span className="etiqueta">Fuente:</span>{' '}
          <span className="valor">{fuente}</span>
        </p>
        <p>
          <span className="etiqueta">Estado:</span>{' '}
          <span className={`valor estado ${estado.toLowerCase()}`}>{estado}</span>
        </p>
        {observaciones && (
          <p>
            <span className="etiqueta">Observaciones:</span>{' '}
            <span className="valor">{observaciones}</span>
          </p>
        )}
      </div>

      <div className="acciones">
        <Link to={`/clientes/editar/${cliente._id}`} className="btn btn-azul">
          <Edit size={12} style={{ marginRight: "5px" }} />
          Editar Cliente
        </Link>

        <Link to={`/interacciones/nueva-interaccion/${cliente._id}`} className="btn btn-naranja">
          <Handshake size={12} style={{ marginRight: "5px" }} />
          Nueva Interacción
        </Link>

        <button 
          type="button" 
          className="btn btn-rojo btn-eliminar"
          onClick={eliminarCliente}
        >
          <X size={15} style={{ marginRight: "5px" }} />
          Eliminar Cliente
        </button>
      </div>
    </li>
  );
};

export default ClienteItem;
