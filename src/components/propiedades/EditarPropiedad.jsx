// EditarPropiedad.jsx
/*Formulario para editar una propiedad existente.
Hace GET /propiedades/:id para cargar la info.
Permite editar, agregar nuevas imágenes, eliminar imágenes existentes.
Envía cambios con PUT /propiedades/:id usando FormData.*/

import React, { Fragment, useState, useEffect } from "react";
import "./Propiedades.css";
import api from "../../config/axios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

function EditarPropiedad() {
  const { id } = useParams(); // ID de la URL
  const navigate = useNavigate();

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
  const [imagenesActuales, setImagenesActuales] = useState([]); // Imágenes que ya existen
  const [nuevasImagenes, setNuevasImagenes] = useState([]); // Nuevas imágenes a subir
  const [previewsNuevas, setPreviewsNuevas] = useState([]); // Previews de nuevas imágenes

  // Construir URL de imagen existente
  const construirUrlImagen = (filename) => {
    return `http://localhost:5000/uploads/propiedades/${filename}`;
  };

  // Cargar datos de la propiedad
  useEffect(() => {
    const fetchPropiedad = async () => {
      try {
        const response = await api.get(`/propiedades/${id}`);//OBTIENE datos del servidor
        const propiedadData = {// 2. PREPARA los datos para el formulario
          ...response.data,// Copia todos los datos de la respuesta
          precio_venta: response.data.precio_venta || "",// Convierte null a string vacío
          precio_alquiler: response.data.precio_alquiler || "",
          habitaciones: response.data.habitaciones || "",
          sanitarios: response.data.sanitarios || "",
        };
        setFormData(propiedadData);// 3. LLENA el formulario con los datos
        setImagenesActuales(response.data.fotos || []); // 4. CARGA las imágenes existentes
      } catch (error) {
        console.error("Error al obtener propiedad:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar la propiedad",
        });
      }
    };
    fetchPropiedad();
  }, [id]);

  // Manejar cambios en inputs normales
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ELIMINAR imagen actual - simplificado
  const eliminarImagenActual = (indexToRemove) => {
    const nuevasImagenesActuales = imagenesActuales.filter((_, index) => index !== indexToRemove);
    setImagenesActuales(nuevasImagenesActuales); // Actualizar inmediatamente en el estado
  };

  const handleNuevasImagenes = (e) => {
  const files = Array.from(e.target.files);
  
  if (files.length > 0) {
    // VALIDACIÓN: Calcular total de imágenes (existentes + nuevas)
    const totalImagenes = imagenesActuales.length + files.length;
    
    // Si excede 5, mostrar mensaje y cancelar
    if (totalImagenes > 5) {
      const imagenesPermitidas = 5 - imagenesActuales.length;
      
      Swal.fire({
        icon: 'warning',
        title: 'Límite de imágenes',
        text: `Solo puedes tener máximo 5 imágenes. Actualmente tienes ${imagenesActuales.length}, puedes agregar ${imagenesPermitidas} más.`,
        width: '400px'
      });
      
      e.target.value = ''; // Limpiar input
      return; // Cancelar operación
    }
    
    // Si está dentro del límite, proceder normalmente
    setNuevasImagenes(files);
    
    //Crear previews para nuevas imágenes
    const previewPromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });
    
    Promise.all(previewPromises).then(previews => {
      setPreviewsNuevas(previews);
    });
  } else {
    setNuevasImagenes([]);
    setPreviewsNuevas([]);
  }
};

  // Eliminar nueva imagen antes de enviar
  const eliminarNuevaImagen = (indexToRemove) => {
    const nuevasImagenesFiltradas = nuevasImagenes.filter((_, index) => index !== indexToRemove);
    const previewsFiltrados = previewsNuevas.filter((_, index) => index !== indexToRemove);
    setNuevasImagenes(nuevasImagenesFiltradas);
    setPreviewsNuevas(previewsFiltrados);
  };

  const { titulo, direccion, ciudad } = formData;
  const isFormValid = titulo.trim() && direccion.trim() && ciudad.trim();

  // ENVIAR CAMBIOS - SIMPLIFICADO
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const dataToSend = new FormData();
      
      // Agregar datos del formulario
      dataToSend.append('titulo', formData.titulo);
      dataToSend.append('descripcion', formData.descripcion);
      dataToSend.append('tipo_inmueble', formData.tipo_inmueble);
      dataToSend.append('estado_inmueble', formData.estado_inmueble);
      dataToSend.append('direccion', formData.direccion);
      dataToSend.append('ciudad', formData.ciudad);
      
      // Agregar números solo si existen
      if (formData.precio_venta) dataToSend.append('precio_venta', formData.precio_venta);
      if (formData.precio_alquiler) dataToSend.append('precio_alquiler', formData.precio_alquiler);
      if (formData.habitaciones) dataToSend.append('habitaciones', formData.habitaciones);
      if (formData.sanitarios) dataToSend.append('sanitarios', formData.sanitarios);

      // CLAVE: Enviar solo las imágenes que quedan (las no eliminadas)
      imagenesActuales.forEach(filename => {
        dataToSend.append('fotosExistentes', filename);
      });

      // Agregar nuevas imágenes si existen
      nuevasImagenes.forEach(image => {
        dataToSend.append('fotos', image);
      });

      await api.put(`/propiedades/${id}`, dataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      Swal.fire({
        icon: "success",
        title: "Propiedad actualizada",
        timer: 2000,
        showConfirmButton: false,
        width: '400px'
      });
      navigate("/propiedades");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: error.response?.data?.mensaje || "No se pudo actualizar la propiedad",
        width: '400px'
      });
    }
  };


  return (
    <Fragment>
      <h2>Editar Propiedad</h2>
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
          <select
            id="tipo_inmueble"
            name="tipo_inmueble"
            value={formData.tipo_inmueble}
            onChange={handleChange}
          >
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
          <select
            id="estado_inmueble"
            name="estado_inmueble"
            value={formData.estado_inmueble}
            onChange={handleChange}
          >
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

        {/* SECCIÓN SIMPLIFICADA: Imágenes actuales */}
        {imagenesActuales.length > 0 && (
          <div className="form-group">
            <label>Imágenes actuales ({imagenesActuales.length})</label>
            <div className="images-preview">
              {imagenesActuales.map((filename, index) => (
                <div key={index} className="image-preview-item existing-image">
                  <img 
                    src={construirUrlImagen(filename)} 
                    alt={`Imagen ${index + 1}`} 
                    className="preview-img" 
                  />
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={() => eliminarImagenActual(index)} // Eliminar por índice, más simple
                    title="Eliminar esta imagen"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECCIÓN: Agregar nuevas imágenes */}
        <div className="form-group">
          <label htmlFor="nuevas_fotos">Agregar nuevas imágenes</label>
          <input 
            type="file" 
            id="nuevas_fotos" 
            name="nuevas_fotos" 
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleNuevasImagenes}
            multiple
          />
          {previewsNuevas.length > 0 && (
            <div className="images-preview">
              {previewsNuevas.map((preview, index) => (
                <div key={index} className="image-preview-item new-image">
                  <img src={preview} alt={`Nueva imagen ${index + 1}`} className="preview-img" />
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={() => eliminarNuevaImagen(index)}
                  >
                    X
                  </button>
                </div>
              ))}
              <p className="preview-info">{nuevasImagenes.length} nueva(s) imagen(es)</p>
            </div>
          )}
        </div>

        <button type="submit" className="form-button" disabled={!isFormValid}>
          Guardar cambios
        </button>
      </form>
    </Fragment>
  );
}

export default EditarPropiedad;