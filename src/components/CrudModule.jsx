import { useEffect, useState } from 'react'
import DataTable from './DataTable.jsx'
import { list, create, update, nextCode } from '../services/databaseService'
import { useAuth } from '../core/ProtectedRoute.jsx'
export default function CrudModule({ col, fields, columns, prefix, validate, adminOnly }) {
  const { user, canWrite, rol } = useAuth(); const allowed = canWrite && (!adminOnly || rol === 'Administrador')
  const empty = Object.fromEntries(fields.map((f) => [f.k, f.def ?? '']))
  const [rows, setRows] = useState([]); const [form, setForm] = useState(null); const [err, setErr] = useState(''); const [loading, setLoading] = useState(true)
  const load = () => list(col).then(setRows).catch((e) => setErr(e.message)).finally(() => setLoading(false))
  useEffect(() => { load() }, [])
  const save = async (e) => { e.preventDefault(); setErr('')
    try { const { id, createdAt, createdBy, updatedAt, ...data } = form; fields.forEach((f) => { if (f.type === 'number') data[f.k] = Number(data[f.k] || 0) })
      const v = validate?.(data); if (v) throw new Error(v)
      if (id) await update(col, id, data); else await create(col, prefix ? { ...data, codigo: data.codigo || nextCode(prefix) } : data, user)
      setForm(null); load() } catch (x) { setErr(x.message) } }
  return (<div>{allowed && <button className="primary" onClick={() => setForm(empty)}>+ Nuevo</button>}
    <DataTable columns={columns} rows={rows} loading={loading} error={err && !form ? err : ''} actions={allowed ? (r) => <button onClick={() => setForm(r)}>Editar</button> : null} />
    {form && <div className="modal"><form className="box" onSubmit={save}><h3>{form.id ? 'Editar' : 'Nuevo'}</h3>
      {fields.map((f) => <label key={f.k}>{f.label}{f.options ? <select value={form[f.k] ?? ''} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} required={f.req}><option value="">—</option>{f.options.map((o) => <option key={o}>{o}</option>)}</select>
        : <input type={f.type || 'text'} step="any" value={form[f.k] ?? ''} required={f.req} readOnly={f.ro && !!form.id} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} />}</label>)}
      {err && <p className="err">{err}</p>}<div className="row"><button type="button" onClick={() => { setForm(null); setErr('') }}>Cancelar</button><button className="primary">Guardar</button></div></form></div>}</div>)
}
