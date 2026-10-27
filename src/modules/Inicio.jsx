import { useEffect, useState } from 'react'
import { list } from '../services/databaseService'
import { useAuth } from '../core/ProtectedRoute.jsx'
import { money } from '../config/settings'
export default function Inicio() {
  const { rol } = useAuth(); const [d, setD] = useState(null); const today = new Date().toDateString()
  useEffect(() => { (async () => { const [v, p, pr] = await Promise.all([list('ventas'), list('pedidos'), list('productos')])
    const hoy = (x) => x.createdAt?.toDate?.().toDateString() === today
    let g = 0; if (['Administrador', 'Supervisor'].includes(rol)) g = (await list('movimientosFinancieros')).filter((x) => x.tipo === 'Egreso' && hoy(x)).reduce((s, x) => s + x.monto, 0)
    setD({ ventas: v.filter(hoy).reduce((s, x) => s + x.total, 0), ped: p.filter((x) => ['Pendiente', 'Confirmado'].includes(x.estado)).length, bajo: pr.filter((x) => x.stock <= 10), g }) })().catch(() => setD(false)) }, [])
  if (d === null) return <p>Cargando…</p>; if (!d) return <p className="err">No se pudieron cargar los indicadores.</p>
  return (<div><div className="cards"><div><small>Ventas de hoy</small><b>{money(d.ventas)}</b></div><div><small>Pedidos pendientes</small><b>{d.ped}</b></div><div><small>Stock bajo (≤10)</small><b>{d.bajo.length}</b></div><div><small>Gastos de hoy</small><b>{money(d.g)}</b></div></div>
    {d.bajo.length > 0 && <p className="note">Stock bajo: {d.bajo.map((p) => `${p.codigo} (${p.stock})`).join(', ')}</p>}</div>)
}
