import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import Header from './components/layout/Header';
import Navegacion from './components/layout/Navegacion';
import Spinner from './components/layout/Spinner'; // Asumo que tienes este componente

// Components
import Home from './components/Home';

// Clientes
import Clientes from './components/clientes/ClientesList';
import NuevoCliente from './components/clientes/NuevoCliente';
import EditarCliente from './components/clientes/EditarCliente';

// Propiedades
import Propiedades from './components/propiedades/PropiedadesList';
import NuevaPropiedad from './components/propiedades/NuevaPropiedad';
import EditarPropiedad from './components/propiedades/EditarPropiedad';

// Interacciones
import Interacciones from './components/interacciones/InteraccionesList';
import NuevaInteraccion from './components/interacciones/NuevaInteraccion';
import EditarInteraccion from './components/interacciones/EditarInteraccion';

// Auth
import Login from './components/auth/Login';

// Context
import { CRMContext, CRMProvider } from './contex/CRMcontext';

// 1. Creamos un componente interno para poder usar el Contexto correctamente
function AppContent() {
  const [auth, guardarAuth, cargandoContext] = useContext(CRMContext);

  // Mientras la aplicación lee el localStorage para ver si hay un token (de Piedecuesta o donde sea)
  // mostramos el Spinner para evitar que nos rebote al login por error.
  if (cargandoContext) return <Spinner />;

  return (
    <>
      <Header />
      <Routes>
        {/* RUTA DE LOGIN */}
        <Route path="/iniciar-sesion" element={<Login />} />

        {/* PROTECCIÓN GLOBAL DE RUTAS */}
        <Route
          path="/*"
          element={
            // Si el usuario NO está autenticado, lo mandamos al login de una
            !auth.auth ? (
              <Navigate to="/iniciar-sesion" replace />
            ) : (
              // Si SÍ está autenticado, mostramos el layout y el contenido
              <div className="grid contenedor contenido-principal">
                <Navegacion />
                <main className="caja-contenido col-9">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    
                    {/* Clientes */}
                    <Route path="/clientes" element={<Clientes />} />
                    <Route path="/clientes/nuevo-cliente" element={<NuevoCliente />} />
                    <Route path="/clientes/editar/:id" element={<EditarCliente />} />

                    {/* Propiedades */}
                    <Route path="/propiedades" element={<Propiedades />} />
                    <Route path="/propiedades/nueva-propiedad" element={<NuevaPropiedad />} />
                    <Route path="/propiedades/editar/:id" element={<EditarPropiedad />} />

                    {/* Interacciones */}
                    <Route path="/interacciones" element={<Interacciones />} />
                    <Route path="/interacciones/nueva-interaccion/:id" element={<NuevaInteraccion />} />
                    <Route path="/interacciones/editar/:id" element={<EditarInteraccion />} />
                    
                    {/* Redirección por si escriben una ruta que no existe dentro del layout */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            )
          }
        />
      </Routes>
    </>
  );
}

// 2. El componente principal solo envuelve al contenido con el Provider
function App() {
  return (
    <CRMProvider>
        <AppContent />
    </CRMProvider>
  );
}

export default App;