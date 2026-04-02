// EditarCliente.jsx
import React, { Fragment, useState, useEffect } from "react";
import "./Clientes.css";
import api from "../../config/axios"; // instancia personalizada de axios
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";

function EditarCliente() {
  const { id } = useParams(); // id que viene desde la URL
  const navigate = useNavigate();

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

  // Traer datos del cliente cuando carga el componente
  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await api.get(`/clientes/${id}`);
        setFormData(response.data); // rellenar el formulario con datos del cliente
      } catch (error) {
        console.error("Error al obtener cliente:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar el cliente 🚨",
        });
      }
    };

    fetchCliente();
  }, [id]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const { nombre, apellido, email, telefono } = formData;
  const isFormValid =
    nombre.trim() && apellido.trim() && email.trim() && telefono.trim();

  
  // Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/clientes/${id}`, formData);
      Swal.fire({
        icon: "success",
        title: "Cliente actualizado",
        timer: 2000,
        showConfirmButton: false,
        width: '400px'
      });
      navigate("/clientes");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Revisa el correo",
        text:
          error.response?.data?.mensaje ||
          "No se pudo actualizar el cliente",
        width: '400px'
      });
    }
  };


  return (
    <Fragment>
      <h2>Editar Cliente</h2>
      <form className="cliente-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre *</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="apellido">Apellido *</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={apellido}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Correo electrónico *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefono">Teléfono *</label>
          <input
            type="text"
            id="telefono"
            name="telefono"
            value={telefono}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tipo_cliente">Tipo de cliente</label>
          <select
            id="tipo_cliente"
            name="tipo_cliente"
            value={formData.tipo_cliente}
            onChange={handleChange}
          >
            <option value="Comprador">Comprador</option>
            <option value="Arrendatario">Arrendatario</option>
            <option value="Inversionista">Inversionista</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="fuente">Fuente</label>
          <select
            id="fuente"
            name="fuente"
            value={formData.fuente}
            onChange={handleChange}
          >
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
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="observaciones">Observaciones</label>
          <textarea
            id="observaciones"
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>

        <button type="submit" className="form-button" disabled={!isFormValid}>
          Guardar cambios
        </button>
      </form>
    </Fragment>
  );
}

export default EditarCliente;
