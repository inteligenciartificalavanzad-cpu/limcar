import { useState } from 'react'
import { login } from '../services/authService'
import { APP } from '../config/settings'
export default function Login() {
  const [email, setE] = useState(''); const [pass, setP] = useState(''); const [err, setErr] = useState(''); const [b, setB] = useState(false)
  const go = async (e) => { e.preventDefault(); setB(true); setErr(''); try { await login(email, pass) } catch (x) { setErr(x.message) } setB(false) }
  return (<div className="center"><form className="box login" onSubmit={go}><h1>{APP.nombre}</h1><p>{APP.subtitulo}</p>
    <input type="email" placeholder="Correo" value={email} onChange={(e) => setE(e.target.value)} required />
    <input type="password" placeholder="Contraseña" value={pass} onChange={(e) => setP(e.target.value)} required />
    {err && <p className="err">{err}</p>}<button className="primary" disabled={b}>{b ? 'Entrando…' : 'Ingresar'}</button></form></div>)
}
