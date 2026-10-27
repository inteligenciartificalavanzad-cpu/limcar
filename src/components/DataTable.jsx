import { useState } from 'react'
export default function DataTable({ columns, rows, loading, error, actions, pageSize = 20 }) {
  const [q, setQ] = useState(''); const [p, setP] = useState(0)
  const f = rows.filter((r) => !q || JSON.stringify(Object.values(r)).toLowerCase().includes(q.toLowerCase()))
  const pg = f.slice(p * pageSize, (p + 1) * pageSize)
  if (error) return <p className="err">{error}</p>
  return (<div><input className="search" placeholder="Buscar…" value={q} onChange={(e) => { setQ(e.target.value); setP(0) }} />
    <div className="scroll"><table><thead><tr>{columns.map((c) => <th key={c.k}>{c.label}</th>)}{actions && <th></th>}</tr></thead>
      <tbody>{loading ? <tr><td colSpan={9}>Cargando…</td></tr> : pg.length === 0 ? <tr><td colSpan={9}>Sin resultados</td></tr> :
        pg.map((r) => <tr key={r.id}>{columns.map((c) => <td key={c.k}>{c.render ? c.render(r) : String(r[c.k] ?? '')}</td>)}{actions && <td className="act">{actions(r)}</td>}</tr>)}</tbody></table></div>
    <div className="pager"><button disabled={p === 0} onClick={() => setP(p - 1)}>‹</button><span>{p + 1}/{Math.max(1, Math.ceil(f.length / pageSize))}</span>
      <button disabled={(p + 1) * pageSize >= f.length} onClick={() => setP(p + 1)}>›</button></div></div>)
}
