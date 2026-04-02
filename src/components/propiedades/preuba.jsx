/**PropiedadItem.jsx (el hijo)
Este archivo representa a una sola propiedad.
Responsabilidades:
Mostrar los datos de la propiedad (título, dirección, precio, tipo, etc.).
Botón Editar → te redirige a la página de edición (/propiedades/editar/:id).
Botón Eliminar → abre un SweetAlert, llama al backend (DELETE /propiedades/:id) y si todo sale bien avisa al padre (onPropiedadEliminada). */

import React from 'react';
import './Propiedades.css';
import { Link } from 'react-router-dom';
import { Edit, X } from "lucide-react"; // íconos
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
    sanitarios
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
            title: "Propiedad Eliminada",
            timer: 2000,
            showConfirmButton: false,
            width: '400px'
          });

          // Avisamos al padre para que quite la propiedad de la lista
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
      <div className="info-propiedad">
        <p>
          <span className="etiqueta">Título:</span>{' '}
          <span className="valor">{titulo}</span>
        </p>
        <p>
          <span className="etiqueta">Dirección:</span>{' '}
          <span className="valor">{direccion}, {ciudad}</span>
        </p>
        <p>
          <span className="etiqueta">Tipo:</span>{' '}
          <span className="valor">{tipo_inmueble || 'No especificado'}</span>
        </p>
        <p>
          <span className="etiqueta">Estado:</span>{' '}
          <span className={`valor estado ${estado_inmueble ? estado_inmueble.toLowerCase() : 'disponible'}`}>
            {estado_inmueble || 'Disponible'}
          </span>
        </p>
        <p>
          <span className="etiqueta">Precio:</span>{' '}
          <span className="valor">{mostrarPrecio()}</span>
        </p>
        {(habitaciones || sanitarios) && (
          <p>
            <span className="etiqueta">Detalles:</span>{' '}
            <span className="valor">
              {habitaciones ? `${habitaciones} hab.` : ''} 
              {habitaciones && sanitarios ? ' | ' : ''}
              {sanitarios ? `${sanitarios} baños` : ''}
            </span>
          </p>
        )}
        {descripcion && (
          <p>
            <span className="etiqueta">Descripción:</span>{' '}
            <span className="valor">{descripcion}</span>
          </p>
        )}
      </div>

      <div className="acciones">
        <Link to={`/propiedades/editar/${propiedad._id}`} className="btn btn-azul">
          <Edit size={10} style={{ marginRight: "18px" }} />
          Editar Propiedad
        </Link>

        <button 
          type="button" 
          className="btn btn-rojo btn-eliminar"
          onClick={eliminarPropiedad}
        >
          <X size={10} style={{ marginRight: "5px" }} />
          Eliminar Propiedad
        </button>
      </div>
    </li>
  );
};

export default PropiedadItem;

/* Formulario para crear una nueva propiedad.

Campos típicos: dirección, precio, tipo, estado, descripción, dueño/cliente asociado, etc.

Al enviar el formulario → POST /propiedades.

import React, { Fragment, useState } from "react";  

import "./Propiedades.css";

import api from "../../config/axios"; // instancia personalizada

import Swal from 'sweetalert2';



function NuevaPropiedad() {

  const initialState = {

    titulo: "",

    descripcion: "",

    tipo_inmueble: "Apartamento",

    estado_inmueble: "Disponible",

    precio_venta: "",

    precio_alquiler: "",

    direccion: "",

    ciudad: "",

    habitaciones: "",

    sanitarios: "",

  };



  const [formData, setFormData] = useState(initialState);

  const [selectedImage, setSelectedImage] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);



  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

  };



  // Manejar selección de imagen

  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (file) {

      setSelectedImage(file);

      // Crear preview de la imagen

      const reader = new FileReader();

      reader.onloadend = () => {

        setImagePreview(reader.result);

      };

      reader.readAsDataURL(file);

    } else {

      setSelectedImage(null);

      setImagePreview(null);

    }

  };



  const { titulo, direccion, ciudad } = formData;

  const isFormValid = titulo.trim() && direccion.trim() && ciudad.trim();



  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!isFormValid) return;



    try {

      // Crear FormData para enviar archivos

      const dataToSend = new FormData();

     

      // Agregar todos los campos del formulario

      dataToSend.append('titulo', formData.titulo);

      dataToSend.append('descripcion', formData.descripcion);

      dataToSend.append('tipo_inmueble', formData.tipo_inmueble);

      dataToSend.append('estado_inmueble', formData.estado_inmueble);

      dataToSend.append('direccion', formData.direccion);

      dataToSend.append('ciudad', formData.ciudad);

     

      // Agregar campos numéricos solo si tienen valor

      if (formData.precio_venta) {

        dataToSend.append('precio_venta', formData.precio_venta);

      }

      if (formData.precio_alquiler) {

        dataToSend.append('precio_alquiler', formData.precio_alquiler);

      }

      if (formData.habitaciones) {

        dataToSend.append('habitaciones', formData.habitaciones);

      }

      if (formData.sanitarios) {

        dataToSend.append('sanitarios', formData.sanitarios);

      }

     

      // Agregar imagen si fue seleccionada

      if (selectedImage) {

        dataToSend.append('fotos', selectedImage);

      }



      const response = await api.post("/propiedades", dataToSend, {

        headers: {

          'Content-Type': 'multipart/form-data'

        }

      });

      console.log("Propiedad creada ✅:", response.data);



      // Mensaje de éxito

      Swal.fire({

        icon: 'success',

        title: '¡Bien hecho!',

        text: 'Propiedad guardada con éxito 🎉',

        timer: 2000,

        showConfirmButton: false,

        width: '400px'

      });



      // Resetear formulario e imagen

      setFormData(initialState);

      setSelectedImage(null);

      setImagePreview(null);

    } catch (error) {

      if (error.response && error.response.status === 400) {

        Swal.fire({

          icon: 'warning',

          title: 'Oops...',

          text: error.response.data.mensaje || error.response.data.error,

          width: '400px',

          timer: 2000,

          showConfirmButton: false

        });

      } else {

        console.error("Error al guardar propiedad:", error);

        Swal.fire({

          icon: 'error',

          title: 'Error de conexión',

          text: 'No se pudo conectar con el servidor 🚨',

          timer: 2000,

          showConfirmButton: false

        });

      }

    }

  };



  return (

    <Fragment>

      <h2>Nueva Propiedad</h2>

      <form className="propiedad-form" onSubmit={handleSubmit}>

        <div className="form-group">

          <label htmlFor="titulo">Título *</label>

          <input

            type="text"

            id="titulo"

            name="titulo"

            value={titulo}

            onChange={handleChange}

            required

            placeholder="Ej: Apartamento en zona norte"

          />

        </div>



        <div className="form-group">

          <label htmlFor="direccion">Dirección *</label>

          <input

            type="text"

            id="direccion"

            name="direccion"

            value={direccion}

            onChange={handleChange}

            required

            placeholder="Ej: Carrera 35 #42-18"

          />

        </div>



        <div className="form-group">

          <label htmlFor="ciudad">Ciudad *</label>

          <input

            type="text"

            id="ciudad"

            name="ciudad"

            value={ciudad}

            onChange={handleChange}

            required

            placeholder="Ej: Bucaramanga"

          />

        </div>



        <div className="form-group">

          <label htmlFor="tipo_inmueble">Tipo de inmueble</label>

          <select id="tipo_inmueble" name="tipo_inmueble" value={formData.tipo_inmueble} onChange={handleChange}>

            <option value="Apartamento">Apartamento</option>

            <option value="Casa">Casa</option>

            <option value="Oficina">Oficina</option>

            <option value="Local">Local</option>

            <option value="Lote">Lote</option>

            <option value="Finca">Finca</option>

          </select>

        </div>



        <div className="form-group">

          <label htmlFor="estado_inmueble">Estado del inmueble</label>

          <select id="estado_inmueble" name="estado_inmueble" value={formData.estado_inmueble} onChange={handleChange}>

            <option value="Disponible">Disponible</option>

            <option value="Vendido">Vendido</option>

            <option value="Alquilado">Alquilado</option>

            <option value="Reservado">Reservado</option>

            <option value="Inactivo">Inactivo</option>

          </select>

        </div>



        <div className="form-group">

          <label htmlFor="precio_venta">Precio de venta</label>

          <input

            type="number"

            id="precio_venta"

            name="precio_venta"

            value={formData.precio_venta}

            onChange={handleChange}

            min="0"

            placeholder="Ej: 150000000"

          />

        </div>



        <div className="form-group">

          <label htmlFor="precio_alquiler">Precio de alquiler</label>

          <input

            type="number"

            id="precio_alquiler"

            name="precio_alquiler"

            value={formData.precio_alquiler}

            onChange={handleChange}

            min="0"

            placeholder="Ej: 1200000"

          />

        </div>



        <div className="form-group">

          <label htmlFor="habitaciones">Número de habitaciones</label>

          <input

            type="number"

            id="habitaciones"

            name="habitaciones"

            value={formData.habitaciones}

            onChange={handleChange}

            min="0"

            placeholder="Ej: 3"

          />

        </div>



        <div className="form-group">

          <label htmlFor="sanitarios">Número de sanitarios</label>

          <input

            type="number"

            id="sanitarios"

            name="sanitarios"

            value={formData.sanitarios}

            onChange={handleChange}

            min="0"

            placeholder="Ej: 2"

          />

        </div>



        <div className="form-group">

          <label htmlFor="descripcion">Descripción</label>

          <textarea

            id="descripcion"

            name="descripcion"

            value={formData.descripcion}

            onChange={handleChange}

            rows="3"

            placeholder="Describe las características principales de la propiedad..."

          ></textarea>

        </div>



        <div className="form-group">

          <label htmlFor="fotos">Imagen de la propiedad</label>

          <input

            type="file"

            id="fotos"

            name="fotos"

            accept="image/jpeg,image/png,image/webp,image/gif"

            onChange={handleImageChange}

          />

          {imagePreview && (

            <div className="image-preview">

              <img src={imagePreview} alt="Preview" className="preview-img" />

            </div>

          )}

        </div>



        <button type="submit" className="form-button" disabled={!isFormValid}>

          Guardar propiedad

        </button>

      </form>

    </Fragment>

  );

}



export default NuevaPropiedad; */