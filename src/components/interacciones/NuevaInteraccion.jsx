import React, { useState, useEffect, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/axios";
import Swal from "sweetalert2";

function NuevaInteraccion() {
  const { id } = useParams(); // Cambio: usar "id" para mantener consistencia
  const navigate = useNavigate();
  
  const [clienteInfo, setClienteInfo] = useState(null);
  const [cargandoCliente, setCargandoCliente] = useState(false);
  
  const [formData, setFormData] = useState({
    tipo: "Llamada",
    descripcion: "",
    fechaHora: new Date().toISOString().slice(0, 16), // datetime-local format
    resultado: "Pendiente",
    propiedad: "",
    fechaVencimiento: "",
    completada: false,
  });

  // Cargar información del cliente si viene por URL
  useEffect(() => {
    if (id) {
      const fetchCliente = async () => {
        setCargandoCliente(true);
        try {
          const response = await api.get(`/clientes/${id}`);
          setClienteInfo(response.data);
        } catch (error) {
          console.error("Error cargando cliente:", error);
          Swal.fire({
            icon: "error",
            title: "Cliente no encontrado",
            text: "No se pudo cargar la información del cliente",
            timer: 2000,
            showConfirmButton: false,
          });
          navigate("/interacciones");
        } finally {
          setCargandoCliente(false);
        }
      };
      fetchCliente();
    }
  }, [id, navigate]);

  // Manejo de inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  // Validación del formulario
  const isFormValid = () => {
    if (!id) return false;
    if (!formData.tipo) return false;
    if (formData.tipo !== 'Visita' && !formData.descripcion.trim()) return false;
    if (formData.tipo === 'Tarea' && !formData.fechaVencimiento) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    try {
      const dataToSend = {
        ...formData,
        cliente: id, // Usar el id de la URL
      };

      // Limpiar campos opcionales vacíos
      if (!dataToSend.propiedad) delete dataToSend.propiedad;
      if (dataToSend.tipo !== 'Tarea') {
        delete dataToSend.fechaVencimiento;
        delete dataToSend.completada;
      }
       //console.log para ver qué estás enviando
       console.log("📤 Datos que se enviarán al backend:", dataToSend);


      const response = await api.post("/interacciones/nueva-interaccion", dataToSend);
      console.log("Interacción creada ✅:", response.data);

      Swal.fire({
        icon: "success",
        title: "¡Interacción guardada!",
        text: "La interacción se registró correctamente 🎉",
        timer: 2000,
        showConfirmButton: false,
        width: "400px",
      });

      // Redirigir de vuelta a la lista de interacciones
      navigate("/interacciones");
    } catch (error) {
      console.error("Error al guardar interacción:", error);
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: error.response?.data?.message || "No se pudo registrar la interacción 🚨",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  if (!id) {
    return (
      <Fragment>
        <h2>Nueva Interacción</h2>
        <div className="alert alert-warning">
          <p>⚠️ Debes seleccionar un cliente primero desde la lista de interacciones.</p>
          <button 
            onClick={() => navigate("/interacciones")}
            className="form-button"
          >
            Volver a Interacciones
          </button>
        </div>
      </Fragment>
    );
  }

  if (cargandoCliente) {
    return (
      <Fragment>
        <h2>Nueva Interacción</h2>
        <p>Cargando información del cliente...</p>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <h2>Nueva Interacción</h2>
      
      {clienteInfo && (
        <div className="cliente-info-box">
          <h3>Cliente seleccionado:</h3>
          <p><strong>{clienteInfo.nombre} {clienteInfo.apellido}</strong></p>
          {clienteInfo.email && <p>Email: {clienteInfo.email}</p>}
          {clienteInfo.telefono && <p>Teléfono: {clienteInfo.telefono}</p>}
        </div>
      )}

      <form className="cliente-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="tipo">Tipo de interacción *</label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
          >
            <option value="Llamada">Llamada</option>
            <option value="Email">Email</option>
            <option value="Reunion">Reunión</option>
            <option value="Visita">Visita</option>
            <option value="Tarea">Tarea</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="fechaHora">Fecha y Hora *</label>
          <input
            type="datetime-local"
            id="fechaHora"
            name="fechaHora"
            value={formData.fechaHora}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">
            Descripción {formData.tipo !== 'Visita' && '*'}
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="4"
            required={formData.tipo !== 'Visita'}
            placeholder="Describe la interacción..."
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="resultado">Resultado *</label>
          <select
            id="resultado"
            name="resultado"
            value={formData.resultado}
            onChange={handleChange}
            required
          >
            <option value="Exitosa">Exitosa</option>
            <option value="No contesta">No contesta</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Cancelada">Cancelada</option>
            <option value="Reprogramada">Reprogramada</option>
          </select>
        </div>

        {/* Campos específicos para Tareas */}
        {formData.tipo === 'Tarea' && (
          <>
            <div className="form-group">
              <label htmlFor="fechaVencimiento">Fecha de Vencimiento *</label>
              <input
                type="datetime-local"
                id="fechaVencimiento"
                name="fechaVencimiento"
                value={formData.fechaVencimiento}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="completada"
                  checked={formData.completada}
                  onChange={handleChange}
                />
                <span>Marcar como completada</span>
              </label>
            </div>
          </>
        )}

        <div className="form-buttons">
          <button 
            type="button" 
            className="form-button btn-secondary"
            onClick={() => navigate("/interacciones")}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="form-button" 
            disabled={!isFormValid()}
          >
            Guardar interacción
          </button>
        </div>
      </form>
    </Fragment>
  );
}

export default NuevaInteraccion;