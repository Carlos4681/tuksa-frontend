import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout
import Header from './components/layout/Header';
import Navegacion from './components/layout/Navegacion';

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
import { CRMProvider } from './contex/CRMcontext';

function App() {
  return (
    <CRMProvider>
      <Header />
      <Routes>

        {/* LOGIN SIN LAYOUT */}
        <Route path="/iniciar-sesion" element={<Login />} />
        

        {/* APP CON LAYOUT */}
        <Route
          path="/*"
          element={
            <>
              
              <div className="grid contenedor contenido-principal">
                <Navegacion />
                <main className="caja-contenido col-9">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/clientes" element={<Clientes />} />
                    <Route path="/clientes/nuevo-cliente" element={<NuevoCliente />} />
                    <Route path="/clientes/editar/:id" element={<EditarCliente />} />

                    <Route path="/propiedades" element={<Propiedades />} />
                    <Route path="/propiedades/nueva-propiedad" element={<NuevaPropiedad />} />
                    <Route path="/propiedades/editar/:id" element={<EditarPropiedad />} />

                    <Route path="/interacciones" element={<Interacciones />} />
                    <Route path="/interacciones/nueva-interaccion/:id" element={<NuevaInteraccion />} />
                    <Route path="/interacciones/editar/:id" element={<EditarInteraccion />} />
                  </Routes>
                </main>
              </div>
            </>
          }
        />

      </Routes>

    </CRMProvider>
  );
}

export default App;

