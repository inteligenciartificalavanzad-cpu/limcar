import { useEffect, useState } from 'react'
import { list, adjustStock } from '../services/databaseService'
import { useAuth } from '../core/ProtectedRoute.jsx'
import DataTable from '../components/DataTable.jsx'
export default function Inventario() {
  const { user, rol } = useAuth(); const [prods, setP] = useState([]); const [movs, setM] = useState([]); const [a, setA] = useState(null); const [err, setErr] = useState('')
  const load = () => Promise.all([list('productos'), list('movimientosInventario', 200)]).then(([p, m]) => { setP(p); setM(m) }).catch((e) => setErr(e.message))
  useEffect(() => { load() }, [])
  const ok = ['Administrador', 'Supervisor'].includes(rol)
  const go = async (e) => { e.preventDefault(); setErr(''); try { if (!a.motivo.trim()) throw new Error('El motivo es obligatorio.'); await adjustStock(a.id, Number(a.delta), a.motivo, user); setA(null); load() } catch (x) { setErr(x.message) } }
  return (<div><h3>Existencias</h3>{err && !a && <p className="err">{err}</p>}
    <DataTable rows={prods} columns={[{ k: 'codigo', label: 'Código' }, { k: 'nombre', label: 'Producto' }, { k: 'stock', label: 'Stock' }, { k: 'unidad', label: 'Unidad' }]} actions={ok ? (r) => <button onClick={() => setA({ id: r.id, delta: '', motivo: '' })}>Ajustar / Merma</button> : null} />
    <h3>Movimientos recientes</h3>
    <DataTable rows={movs} columns={[{ k: 'codigo', label: 'Producto' }, { k: 'tipo', label: 'Tipo' }, { k: 'cantidad', label: 'Cantidad' }, { k: 'saldo', label: 'Saldo' }, { k: 'motivo', label: 'Motivo' }, { k: 'usuario', label: 'Usuario' }]} />
    {a && <div className="modal"><form className="box" onSubmit={go}><h3>Ajuste de stock</h3><label>Cantidad (negativa = merma)<input type="number" step="any" required value={a.delta} onChange={(e) => setA({ ...a, delta: e.target.value })} /></label>
      <label>Motivo<input required value={a.motivo} onChange={(e) => setA({ ...a, motivo: e.target.value })} /></label>{err && <p className="err">{err}</p>}
      <div className="row"><button type="button" onClick={() => { setA(null); setErr('') }}>Cancelar</button><button className="primary">Registrar</button></div></form></div>}</div>)
}
