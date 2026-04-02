import React, { Fragment, useState } from "react";  
import "./Clientes.css"; 
import api from "../../config/axios"; // instancia personalizada
import Swal from 'sweetalert2';

function NuevoCliente() {
  const initialState = {
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    tipo_cliente: "Comprador",
    fuente: "Web",
    estado: "Activo",
    observaciones: "",
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const { nombre, apellido, email, telefono } = formData;
  const isFormValid = nombre.trim() && apellido.trim() && email.trim() && telefono.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const response = await api.post("/clientes", formData);
      console.log("Cliente creado ✅:", response.data);

      // Mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: '¡Bien hecho!',
        text: 'Cliente guardado con éxito 🎉',
        timer: 2000, //segundos que dura la alerta
        showConfirmButton: false,// para eliminar el boton ok
        width: '400px'
      });

      setFormData(initialState);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Mensaje de error de validación
        Swal.fire({
          icon: 'warning',
          title: 'Oops...',
          text: error.response.data.error,
          width: '400px',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        console.error("Error al guardar cliente:", error);
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
      <h2>Nuevo Cliente</h2>
      <form className="cliente-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre *</label>
          <input type="text" id="nombre" name="nombre" value={nombre} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="apellido">Apellido *</label>
          <input type="text" id="apellido" name="apellido" value={apellido} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo electrónico *</label>
          <input type="email" id="email" name="email" value={email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="telefono">Teléfono *</label>
          <input type="text" id="telefono" name="telefono" value={telefono} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="tipo_cliente">Tipo de cliente</label>
          <select id="tipo_cliente" name="tipo_cliente" value={formData.tipo_cliente} onChange={handleChange}>
            <option value="Comprador">Comprador</option>
            <option value="Arrendatario">Arrendatario</option>
            <option value="Inversionista">Inversionista</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="fuente">Fuente</label>
          <select id="fuente" name="fuente" value={formData.fuente} onChange={handleChange}>
            <option value="Web">Web</option>
            <option value="Instagram">Instagram</option>
            <option value="Facebook">Facebook</option>
            <option value="Referido">Referido</option>
            <option value="Google Ads">Google Ads</option>
            <option value="Evento">Evento</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="estado">Estado</label>
          <select id="estado" name="estado" value={formData.estado} onChange={handleChange}>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="observaciones">Observaciones</label>
          <textarea id="observaciones" name="observaciones" value={formData.observaciones} onChange={handleChange} rows="3"></textarea>
        </div>

        <button type="submit" className="form-button" disabled={!isFormValid}>
          Guardar cliente
        </button>
      </form>
    </Fragment>
  );
}

export default NuevoCliente;
