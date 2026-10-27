import { NavLink } from 'react-router-dom'
import { APP, MODULOS } from '../config/settings'
import { logout } from '../services/authService'
import { useAuth } from './ProtectedRoute.jsx'
export default function Sidebar({ open, onClose }) {
  const { rol } = useAuth()
  return (<aside className={'sidebar' + (open ? ' open' : '')}>
    <div className="brand"><b>{APP.nombre}</b><small>{APP.subtitulo}</small></div>
    <nav>{MODULOS.filter(([, , r]) => !r || r.includes(rol)).map(([to, n]) => <NavLink key={to} to={to} end={to === '/'} onClick={onClose}>{n}</NavLink>)}</nav>
    <button className="logout" onClick={logout}>Cerrar sesión</button></aside>)
}
