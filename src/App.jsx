import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './core/ProtectedRoute.jsx'
import MainLayout from './core/MainLayout.jsx'
import Inicio from './modules/Inicio.jsx'
import * as S from './modules/Simple.jsx'
import Lineas from './modules/Lineas.jsx'
import Inventario from './modules/Inventario.jsx'
import Finanzas from './modules/Finanzas.jsx'
import Reportes from './modules/Reportes.jsx'
import Configuracion from './modules/Configuracion.jsx'
export default function App() {
  return (<ProtectedRoute><MainLayout><Routes>
    <Route path="/" element={<Inicio />} /><Route path="/usuarios" element={<S.Usuarios />} /><Route path="/trabajadores" element={<S.Trabajadores />} />
    <Route path="/clientes" element={<S.Clientes />} /><Route path="/catalogo" element={<S.Catalogo />} /><Route path="/proveedores" element={<S.Proveedores />} />
    <Route path="/compras" element={<Lineas isSale={false} />} /><Route path="/inventario" element={<Inventario />} /><Route path="/pedidos" element={<S.Pedidos />} />
    <Route path="/ventas" element={<Lineas isSale />} /><Route path="/repartos" element={<S.Repartos />} /><Route path="/finanzas" element={<Finanzas />} />
    <Route path="/reportes" element={<Reportes />} /><Route path="/configuracion" element={<Configuracion />} /><Route path="*" element={<Navigate to="/" />} />
  </Routes></MainLayout></ProtectedRoute>)
}
