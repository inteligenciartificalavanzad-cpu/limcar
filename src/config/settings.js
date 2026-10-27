export const APP = { nombre: 'LIMCAR', subtitulo: 'Sistema de Ventas y Gestión', version: '1.0.0', moneda: 'S/' }
export const money = (n) => `${APP.moneda} ${Number(n || 0).toFixed(2)}`
export const ROLES = ['Administrador', 'Supervisor', 'Operador', 'Consulta']
export const MODULOS = [
  ['/', 'Inicio'], ['/usuarios', 'Usuarios', ['Administrador']], ['/trabajadores', 'Trabajadores', ['Administrador', 'Supervisor']],
  ['/clientes', 'Clientes'], ['/catalogo', 'Catálogo'], ['/proveedores', 'Proveedores'], ['/compras', 'Compras'],
  ['/inventario', 'Inventario'], ['/pedidos', 'Pedidos'], ['/ventas', 'Ventas'], ['/repartos', 'Repartos'],
  ['/finanzas', 'Finanzas', ['Administrador', 'Supervisor']], ['/reportes', 'Reportes', ['Administrador', 'Supervisor']],
  ['/configuracion', 'Configuración', ['Administrador']]]
