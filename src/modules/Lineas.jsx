import { useEffect, useState } from 'react'
import { list, get, nextCode, create, createSale, receivePurchase } from '../services/databaseService'
import { useAuth } from '../core/ProtectedRoute.jsx'
import DataTable from '../components/DataTable.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { money } from '../config/settings'
// Compras (isSale=false) y Ventas (isSale=true) comparten el formulario de líneas.
export default function Lineas({ isSale }) {
  const { user, canWrite } = useAuth(); const col = isSale ? 'ventas' : 'compras'
  const [rows, setRows] = useState([]); const [prods, setProds] = useState([]); const [terc, setTerc] = useState([])
  const [f, setF] = useState(null); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false); const [conf, setConf] = useState(null)
  const load = () => Promise.all([list(col), list('productos'), list(isSale ? 'clientes' : 'proveedores')]).then(([a, b, c]) => { setRows(a); setProds(b.filter((p) => p.estado === 'Activo')); setTerc(c.filter((x) => x.estado === 'Activo')) }).catch((e) => setErr(e.message))
  useEffect(() => { load() }, [])
  const total = (f?.lineas || []).reduce((s, l) => s + l.cantidad * l.precio, 0)
  const add = (id) => { const p = prods.find((x) => x.id === id); if (!p) return
    setF({ ...f, lineas: [...f.lineas, { productoId: p.id, codigo: p.codigo, nombre: p.nombre, unidad: p.unidad, cantidad: 1, precio: isSale ? p.precio : 0 }] }) }
  const setL = (i, k, v) => setF({ ...f, lineas: f.lineas.map((l, j) => (j === i ? { ...l, [k]: Number(v) } : l)) })
  const save = async () => { setErr(''); if (!f.tercero || !f.lineas.length) return setErr('Selecciona ' + (isSale ? 'cliente' : 'proveedor') + ' y al menos un producto.')
    if (f.lineas.some((l) => !(l.cantidad > 0) || l.precio < 0)) return setErr('Cantidades y precios inválidos.')
    setBusy(true)
    try { const t = terc.find((x) => x.id === f.tercero); const base = { codigo: nextCode(isSale ? 'VTA' : 'CMP'), lineas: f.lineas, total }
      if (isSale) await createSale({ ...base, clienteId: t.id, cliente: t.nombre, pago: f.pago }, user)
      else await create('compras', { ...base, proveedorId: t.id, proveedor: t.nombre, estado: 'Pendiente' }, user)
      setF(null); load() } catch (x) { setErr(x.message) } setBusy(false) }
  const recibir = async () => { try { await receivePurchase(conf, user); setConf(null); load() } catch (x) { setErr(x.message); setConf(null) } }
  return (<div>{canWrite && <button className="primary" onClick={() => setF({ tercero: '', pago: 'Efectivo', lineas: [] })}>+ Nueva {isSale ? 'venta' : 'compra'}</button>}
    {err && !f && <p className="err">{err}</p>}
    <DataTable rows={rows} columns={[{ k: 'codigo', label: 'Código' }, { k: isSale ? 'cliente' : 'proveedor', label: isSale ? 'Cliente' : 'Proveedor' }, { k: 'total', label: 'Total', render: (r) => money(r.total) }, { k: 'estado', label: 'Estado' }, { k: 'fecha', label: 'Fecha', render: (r) => r.createdAt?.toDate?.().toLocaleString() || '' }]}
      actions={!isSale && canWrite ? (r) => r.estado === 'Pendiente' && <button onClick={() => setConf(r.id)}>Recibir</button> : null} />
    <ConfirmDialog open={!!conf} text="¿Confirmar recepción? Esto aumentará el stock una sola vez." onYes={recibir} onNo={() => setConf(null)} />
    {f && <div className="modal"><div className="box wide"><h3>Nueva {isSale ? 'venta' : 'compra'}</h3>
      <label>{isSale ? 'Cliente' : 'Proveedor'}<select value={f.tercero} onChange={(e) => setF({ ...f, tercero: e.target.value })}><option value="">—</option>{terc.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}</select></label>
      {isSale && <label>Forma de pago<select value={f.pago} onChange={(e) => setF({ ...f, pago: e.target.value })}>{['Efectivo', 'Yape/Plin', 'Transferencia', 'Crédito'].map((o) => <option key={o}>{o}</option>)}</select></label>}
      <label>Agregar producto<select value="" onChange={(e) => add(e.target.value)}><option value="">—</option>{prods.map((p) => <option key={p.id} value={p.id}>{p.codigo} · {p.nombre}{isSale ? ` (stock ${p.stock})` : ''}</option>)}</select></label>
      {f.lineas.map((l, i) => <div className="line" key={i}><span>{l.codigo}</span><input type="number" step="any" value={l.cantidad} onChange={(e) => setL(i, 'cantidad', e.target.value)} /><small>{l.unidad}</small><input type="number" step="any" value={l.precio} onChange={(e) => setL(i, 'precio', e.target.value)} /><b>{money(l.cantidad * l.precio)}</b></div>)}
      <h3>Total: {money(total)}</h3>{err && <p className="err">{err}</p>}
      <div className="row"><button onClick={() => { setF(null); setErr('') }}>Cancelar</button><button className="primary" disabled={busy} onClick={save}>{busy ? 'Guardando…' : 'Confirmar'}</button></div></div></div>}</div>)
}
