/*
  * Componente: NuevaPropiedad
  * Descripción: Este formulario permite a un agente inmobiliario crear un nuevo registro de propiedad.
  * Captura datos como título, dirección, precio, y ahora, ¡múltiples imágenes!
  * Al enviar, el formulario empaqueta todos los datos, incluyendo las imágenes,
  * y los envía a la API para que sean guardados en la base de datos.
*/

import React, { Fragment, useState } from "react"; 
import "./Propiedades.css"; 
import api from "../../config/axios"; // instancia personalizada 
import Swal from 'sweetalert2';

function NuevaPropiedad() {
  // Estado inicial del formulario - valores por defecto
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
  // IMPORTANTE: Estados para manejo de imágenes
  const [selectedImages, setSelectedImages] = useState([]); // Archivos seleccionados del input file
  const [imagePreviews, setImagePreviews] = useState([]); // URLs de preview para mostrar las imágenes

  // Función estándar para campos de texto, select, etc.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función para manejar múltiples imágenes
const handleImagesChange = (e) => {
  const files = Array.from(e.target.files); // Convertir FileList a Array

  if (files.length > 5) {
    Swal.fire({
      icon: "warning",
      title: "Máximo 5 imágenes",
      text: "Solo puedes subir hasta 5 imágenes por propiedad 📸",
      timer: 2000,
      showConfirmButton: false
    });
    return; // ❌ no seguimos si hay más de 5
  }

  if (files.length > 0) {
    setSelectedImages(files);

    // Crear previews para cada imagen
    const previewPromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(previewPromises).then(previews => {
      setImagePreviews(previews);
    });
  } else {
    setSelectedImages([]);
    setImagePreviews([]);
  }
};

  // Función para eliminar una imagen específica de la selección
  const removeImage = (indexToRemove) => {
    const newImages = selectedImages.filter((_, index) => index !== indexToRemove);
    const newPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);

    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const { titulo, direccion, ciudad } = formData;
  const isFormValid = titulo.trim() && direccion.trim() && ciudad.trim();

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      // CLAVE: FormData es obligatorio para enviar archivos, NO usar JSON
      const dataToSend = new FormData();

      // IMPORTANTE: Agregar cada campo manualmente a FormData
      dataToSend.append('titulo', formData.titulo);
      dataToSend.append('descripcion', formData.descripcion);
      dataToSend.append('tipo_inmueble', formData.tipo_inmueble);
      dataToSend.append('estado_inmueble', formData.estado_inmueble);
      dataToSend.append('direccion', formData.direccion);
      dataToSend.append('ciudad', formData.ciudad);

      // Solo agregar campos numéricos si tienen valor (evitar strings vacíos)
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

      // CLAVE: Agregar múltiples archivos con el nombre 'fotos'
      if (selectedImages.length > 0) {
        selectedImages.forEach(image => {
          dataToSend.append('fotos', image); // Agregar cada imagen individualmente
        });
      }

      // IMPORTANTE: Cambiar header a multipart/form-data para que multer funcione
      const response = await api.post("/propiedades", dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log("Propiedad creada ✅:", response.data);

      Swal.fire({
        icon: 'success',
        title: '¡Bien hecho!',
        text: 'Propiedad guardada con éxito 🎉',
        timer: 2000,
        showConfirmButton: false,
        width: '400px'
      });

      // Resetear también los estados de múltiples imágenes
      setFormData(initialState);
      setSelectedImages([]); // Limpiar array de archivos seleccionados
      setImagePreviews([]); // Limpiar array de previews
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: error.response.data.mensaje || error.response.data.error, // Tu API puede devolver 'mensaje' o 'error'
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
          <label htmlFor="fotos">Imágenes de la propiedad (puedes seleccionar varias)</label>
          <input 
            type="file" 
            id="fotos" 
            name="fotos" 
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImagesChange}
            multiple // IMPORTANTE: permite seleccionar múltiples archivos
          />
          {/* PREVIEW: Mostrar todas las imágenes seleccionadas */}
          {imagePreviews.length > 0 && (
            <div className="images-preview">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="image-preview-item">
                  <img src={preview} alt={`Preview ${index + 1}`} className="preview-img" />
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <p className="preview-info">{selectedImages.length} imagen(es) seleccionada(s)</p>
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

export default NuevaPropiedad;