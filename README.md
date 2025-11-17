# Backend - Sistema Médico

## Variables de Entorno Requeridas

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
MONGO_URI=tu_mongodb_atlas_uri_aqui
JWT_SECRET=tu_secreto_jwt_super_seguro_aqui
PORT=4000
FRONTEND_URL=https://tu-frontend.vercel.app
```

## Deployment en Render

1. Conecta tu repositorio de GitHub
2. Selecciona "Web Service"
3. Configura las variables de entorno en el dashboard de Render
4. Render detectará automáticamente el comando: `npm start`

## Instalación Local

```bash
npm install
npm start
```
