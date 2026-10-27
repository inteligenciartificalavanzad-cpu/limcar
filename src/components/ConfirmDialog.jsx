export default function ConfirmDialog({ open, text, onYes, onNo }) {
  if (!open) return null
  return (<div className="modal"><div className="box"><p>{text}</p><div className="row"><button onClick={onNo}>Cancelar</button><button className="primary" onClick={onYes}>Confirmar</button></div></div></div>)
}
