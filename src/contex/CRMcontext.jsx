import { createContext, useState, useEffect } from 'react';

export const CRMContext = createContext([{}, () => {}, true]);

export const CRMProvider = (props) => {
    const [auth, guardarAuth] = useState({
        token: '',
        auth: false
    });

    // Esta variable es la clave: evita que la app crea que no estás logueado mientras lee el disco
    const [cargandoContext, setCargandoContext] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            guardarAuth({
                token,
                auth: true
            });
        }
        // Una vez que termina de buscar el token, avisamos que ya no carga
        setCargandoContext(false);
    }, []);

    return (
        <CRMContext.Provider value={[auth, guardarAuth, cargandoContext]}>
            {props.children}
        </CRMContext.Provider>
    );
};