//services/api.js
const API_URL = import.meta.env.VITE_API_URL;

export async function obtenerClientes() {
  try {
    const respuesta = await fetch(`${API_URL}/clientes`);
    if (!respuesta.ok) throw new Error('Error al obtener clientes');
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error('Error en la API:', error);
    return [];
  }
}