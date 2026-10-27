# LIMCAR-WEB
React + Vite + Firebase (Auth + Firestore), publicado en GitHub Pages.

## Puesta en marcha
1. Firebase Console → crea proyecto → activa **Authentication (correo/contraseña)** y **Firestore**.
2. Registra una app web y copia la config a `.env` (ver `.env.example`).
3. Publica las reglas: `firebase deploy --only firestore:rules,firestore:indexes` (o pégalas en la consola).
4. **Primer administrador:** crea el usuario en Authentication; copia su UID; en Firestore crea `usuarios/<UID>` con
   `nombre`, `email`, `rol: "Administrador"`, `estado: "Activo"`. (Haz lo mismo para cada usuario nuevo: el ID del documento DEBE ser el UID.)
5. `npm install && npm run dev`.
6. GitHub: sube el repo a `main`; Settings → Pages → Source: **GitHub Actions**; agrega los 6 valores de `.env` como *Repository secrets* (`VITE_FIREBASE_*`).
7. En Firebase → Authentication → Settings → Authorized domains, agrega `TUUSUARIO.github.io`.

## Limitaciones antes de usar con dinero real
- No hay backend: el stock y los importes los calcula el navegador (con transacciones). Para garantías fuertes migra `createSale`/`receivePurchase` a Cloud Functions.
- Finanzas muestra ventas, cobrado y egresos; **no** calcula utilidad (falta costo de mercadería vendida).
- Pedidos/Repartos son registros simples; sin reserva de stock ni cobros posteriores de ventas a crédito.
- Sin modo offline.
