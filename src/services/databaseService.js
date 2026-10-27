import { db } from '../config/firebase'
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, query, orderBy, limit, runTransaction, serverTimestamp } from 'firebase/firestore'
const withId = (d) => ({ id: d.id, ...d.data() })
export const list = async (col, max = 500) => (await getDocs(query(collection(db, col), orderBy('createdAt', 'desc'), limit(max)))).docs.map(withId)
export const get = async (col, id) => { const s = await getDoc(doc(db, col, id)); return s.exists() ? withId(s) : null }
export const create = async (col, data, user) => (await addDoc(collection(db, col), { ...data, createdAt: serverTimestamp(), createdBy: user?.email || '' })).id
export const update = (col, id, data) => updateDoc(doc(db, col, id), { ...data, updatedAt: serverTimestamp() })
export const nextCode = (prefix) => `${prefix}-${Date.now().toString(36).toUpperCase()}`
const audit = (tx, user, accion, ref) => tx.set(doc(collection(db, 'auditoria')), { accion, ref, usuario: user.email, createdAt: serverTimestamp() })
const mov = (tx, o, user) => tx.set(doc(collection(db, 'movimientosInventario')), { ...o, usuario: user.email, createdAt: serverTimestamp() })

export const receivePurchase = (compraId, user) => runTransaction(db, async (tx) => {
  const cRef = doc(db, 'compras', compraId); const c = await tx.get(cRef)
  if (!c.exists() || c.data().estado !== 'Pendiente') throw new Error('La compra ya fue recibida o no existe.')
  const lines = c.data().lineas
  const prods = await Promise.all(lines.map((l) => tx.get(doc(db, 'productos', l.productoId))))
  const acum = {}
  lines.forEach((l, i) => {
    acum[l.productoId] = (acum[l.productoId] ?? Number(prods[i].data().stock || 0)) + Number(l.cantidad)
    tx.update(prods[i].ref, { stock: acum[l.productoId] })
    mov(tx, { productoId: l.productoId, codigo: l.codigo, tipo: 'Entrada', motivo: 'Compra ' + c.data().codigo, cantidad: Number(l.cantidad), saldo: acum[l.productoId] }, user)
  })
  tx.update(cRef, { estado: 'Recibida', recibidaAt: serverTimestamp() }); audit(tx, user, 'recibir_compra', compraId)
})
export const createSale = (venta, user) => { const sRef = doc(collection(db, 'ventas')); return runTransaction(db, async (tx) => {
  const prods = await Promise.all(venta.lineas.map((l) => tx.get(doc(db, 'productos', l.productoId))))
  const acum = {}
  venta.lineas.forEach((l, i) => {
    acum[l.productoId] = (acum[l.productoId] ?? Number(prods[i].data().stock || 0)) - Number(l.cantidad)
    if (acum[l.productoId] < 0) throw new Error(`Stock insuficiente de ${l.codigo}.`)
  })
  venta.lineas.forEach((l, i) => {
    tx.update(prods[i].ref, { stock: acum[l.productoId] })
    mov(tx, { productoId: l.productoId, codigo: l.codigo, tipo: 'Salida', motivo: 'Venta ' + venta.codigo, cantidad: -Number(l.cantidad), saldo: acum[l.productoId] }, user)
  })
  tx.set(sRef, { ...venta, estado: 'Confirmada', createdAt: serverTimestamp(), createdBy: user.email })
  tx.set(doc(collection(db, 'movimientosFinancieros')), { tipo: 'Ingreso', concepto: 'Venta ' + venta.codigo, monto: venta.total, cobrado: venta.pago === 'Crédito' ? 0 : venta.total, ref: sRef.id, createdAt: serverTimestamp(), createdBy: user.email })
  audit(tx, user, 'crear_venta', sRef.id) }) }
export const adjustStock = (productoId, delta, motivo, user) => runTransaction(db, async (tx) => {
  const p = await tx.get(doc(db, 'productos', productoId)); const stock = Number(p.data().stock || 0) + Number(delta)
  if (stock < 0) throw new Error('El stock no puede quedar negativo.')
  tx.update(p.ref, { stock })
  mov(tx, { productoId, codigo: p.data().codigo, tipo: delta < 0 ? 'Merma' : 'Ajuste', motivo, cantidad: Number(delta), saldo: stock }, user)
  audit(tx, user, 'ajuste_stock', productoId) })
