import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// base './' funciona en GitHub Pages (usuario.github.io/repo/) sin editar nada
export default defineConfig({ plugins: [react()], base: './' })
