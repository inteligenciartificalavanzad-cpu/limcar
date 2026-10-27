import { useLocation } from 'react-router-dom'
import { MODULOS } from '../config/settings'
import { useAuth } from '../core/ProtectedRoute.jsx'
export default function Header({ onMenu }) {
  const { pathname } = useLocation(); const { perfil, rol } = useAuth()
  return (<header className="header"><button className="menu-btn" onClick={onMenu}>☰</button><h2>{MODULOS.find(([p]) => p === pathname)?.[1] || ''}</h2>
    <span className="who">{perfil.nombre} · {rol}</span></header>)
}
