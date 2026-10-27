import { useEffect, useState } from 'react'
import { list } from '../services/databaseService'
import CrudModule from '../components/CrudModule.jsx'
import { money } from '../config/settings'
export const resumen = (m) => ({
  ventas: m.filter((x) => x.tipo === 'Ingreso').reduce((s, x) => s + x.monto, 0),
  cobrado: m.filter((x) => x.tipo === 'Ingreso').reduce((s, x) => s + (x.cobrado ?? x.monto), 0),
  gastos: m.filter((x) => x.tipo === 'Egreso').reduce((s, x) => s + x.monto, 0) })
export default function Finanzas() {
  const [m, setM] = useState([]); useEffect(() => { list('movimientosFinancieros').then(setM).catch(() => {}) }, [])
  const r = resumen(m)
  return (<div><div className="cards"><div><small>Ventas</small><b>{money(r.ventas)}</b></div><div><small>Cobrado</small><b>{money(r.cobrado)}</b></div><div><small>Gastos / egresos</small><b>{money(r.gastos)}</b></div><div><small>Caja estimada</small><b>{money(r.cobrado - r.gastos)}</b></div></div>
    <p className="note">Las ventas generan su ingreso automáticamente: aquí solo registra egresos (gastos, sueldos, pagos a proveedores). La utilidad real requiere costo de mercadería vendida; ver README.</p>
    <CrudModule col="movimientosFinancieros" columns={[{ k: 'tipo', label: 'Tipo' }, { k: 'concepto', label: 'Concepto' }, { k: 'monto', label: 'Monto', render: (x) => money(x.monto) }, { k: 'categoria', label: 'Categoría' }, { k: 'createdBy', label: 'Usuario' }]}
      fields={[{ k: 'tipo', label: 'Tipo', options: ['Egreso'], def: 'Egreso', req: true }, { k: 'categoria', label: 'Categoría', options: ['Gasto operativo', 'Sueldo', 'Pago a proveedor', 'Combustible', 'Otro'], req: true }, { k: 'concepto', label: 'Concepto', req: true }, { k: 'monto', label: 'Monto', type: 'number', req: true }]}
      validate={(d) => (d.monto <= 0 ? 'El monto debe ser mayor a 0' : '')} /></div>)
}
