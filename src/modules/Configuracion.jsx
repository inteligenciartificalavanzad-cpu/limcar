import { APP } from '../config/settings'
export default function Configuracion() {
  return (<div className="box wide"><p><b>Sistema:</b> {APP.nombre} — {APP.subtitulo}</p><p><b>Versión:</b> {APP.version}</p><p><b>Moneda:</b> Soles (PEN)</p>
    <p className="note">Los parámetros críticos (roles y reglas de Firestore) se administran desde Usuarios y firebase/firestore.rules.</p></div>)
}
