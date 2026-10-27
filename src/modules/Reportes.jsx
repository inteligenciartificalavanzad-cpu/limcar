import { useEffect, useState } from 'react'
import { list } from '../services/databaseService'
import DataTable from '../components/DataTable.jsx'
import { money } from '../config/settings'
export default function Reportes() {
  const [v, setV] = useState([]); const [a, setA] = useState(''); const [b, setB] = useState('')
  useEffect(() => { list('ventas', 1000).then(setV).catch(() => {}) }, [])
  const f = v.filter((x) => { const d = x.createdAt?.toDate?.(); if (!d) return false; const s = d.toISOString().slice(0, 10); return (!a || s >= a) && (!b || s <= b) })
  const por = {}; f.forEach((x) => x.lineas.forEach((l) => { por[l.codigo] = por[l.codigo] || { id: l.codigo, codigo: l.codigo, cant: 0, imp: 0 }; por[l.codigo].cant += l.cantidad; por[l.codigo].imp += l.cantidad * l.precio }))
  return (<div><div className="row"><label>Desde<input type="date" value={a} onChange={(e) => setA(e.target.value)} /></label><label>Hasta<input type="date" value={b} onChange={(e) => setB(e.target.value)} /></label></div>
    <div className="cards"><div><small>Ventas (fecha de creación)</small><b>{money(f.reduce((s, x) => s + x.total, 0))}</b></div><div><small>Operaciones</small><b>{f.length}</b></div></div>
    <h3>Productos vendidos</h3><DataTable rows={Object.values(por)} columns={[{ k: 'codigo', label: 'Producto' }, { k: 'cant', label: 'Cantidad' }, { k: 'imp', label: 'Importe', render: (r) => money(r.imp) }]} /></div>)
}
