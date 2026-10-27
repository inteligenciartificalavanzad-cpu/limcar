import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase'
const msg = { 'auth/invalid-credential': 'Correo o contraseña incorrectos.', 'auth/too-many-requests': 'Demasiados intentos. Espera un momento.', 'auth/network-request-failed': 'Sin conexión a internet.' }
export const login = async (email, pass) => {
  try { return await signInWithEmailAndPassword(auth, email, pass) } catch (e) { throw new Error(msg[e.code] || 'No se pudo iniciar sesión.') }
}
export const logout = () => signOut(auth)
export const onSession = (cb) => onAuthStateChanged(auth, cb)
