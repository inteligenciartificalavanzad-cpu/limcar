import { createContext, useContext, useEffect, useState } from 'react'
import { onSession, logout } from '../services/authService'
import { get } from '../services/databaseService'
import Login from '../modules/Login.jsx'
const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)
export default function ProtectedRoute({ children }) {
  const [st, setSt] = useState({ loading: true, user: null, perfil: null })
  useEffect(() => onSession(async (u) => {
    if (!u) return setSt({ loading: false, user: null, perfil: null })
    try { setSt({ loading: false, user: u, perfil: await get('usuarios', u.uid) }) } catch { setSt({ loading: false, user: u, perfil: null }) }
  }), [])
  if (st.loading) return <div className="center">Cargando…</div>
  if (!st.user) return <Login />
  if (!st.perfil || st.perfil.estado !== 'Activo') return <div className="center"><div className="box"><p>Tu cuenta no tiene un perfil activo. Contacta al administrador.</p><button onClick={logout}>Salir</button></div></div>
  const v = { user: st.user, perfil: st.perfil, rol: st.perfil.rol, canWrite: ['Administrador', 'Supervisor', 'Operador'].includes(st.perfil.rol) }
  return <Ctx.Provider value={v}>{children}</Ctx.Provider>
}
