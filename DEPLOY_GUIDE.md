# 📱 Guía de Despliegue en Render.com

## Paso 1: Preparar MongoDB Atlas (Base de datos gratuita)

1. Ve a [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta gratuita
3. Crea un nuevo proyecto
4. Crea un cluster (selecciona tier gratuito M0)
5. Crea un usuario de base de datos:
   - Username: `admin`
   - Password: (genera una contraseña fuerte)
6. Whitelist tu IP o permite todas (0.0.0.0/0)
7. Copia la cadena de conexión (connection string)

La cadena debería verse así:
```
mongodb+srv://admin:TU_PASSWORD@cluster0.mongodb.net/gestionPresupuesto?retryWrites=true&w=majority
```

## Paso 2: Instalar dependencias localmente (opcional para pruebas)

```bash
npm install
```

Para ejecutar localmente:
```bash
npm start
```

O en modo desarrollo (con auto-reload):
```bash
npm install -g nodemon
npm run dev
```

## Paso 3: Subir el código a GitHub

1. Crea un repositorio en GitHub (si no lo tienes)
2. Sube tu código:
   ```bash
   git add .
   git commit -m "Migración a Express + MongoDB"
   git push origin main
   ```

## Paso 4: Desplegar en Render.com

1. Ve a [render.com](https://render.com)
2. Crea una cuenta (puedes usar GitHub)
3. Haz clic en "New +" → "Web Service"
4. Conecta tu repositorio de GitHub
5. Rellena los datos:
   - **Name**: `gestion-presupuesto-api`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
6. Haz clic en "Advanced"
7. Agrega variable de entorno:
   - **Key**: `MONGODB_URI`
   - **Value**: (Pega tu conexión de MongoDB Atlas)
8. Haz clic en "Create Web Service"

¡Listo! Tu API estará en línea en ~2 minutos 🎉

## Paso 5: Probar la API

Tu API estará disponible en:
```
https://gestion-presupuesto-api.onrender.com
```

### Ejemplos de uso:

**Obtener gastos de un usuario:**
```bash
curl https://gestion-presupuesto-api.onrender.com/api/juan
```

**Crear un gasto:**
```bash
curl -X POST https://gestion-presupuesto-api.onrender.com/api/juan \
  -H "Content-Type: application/json" \
  -d '{"descripcion":"Comida","cantidad":25.50,"categoria":"Alimentación"}'
```

**Actualizar un gasto:**
```bash
curl -X PUT https://gestion-presupuesto-api.onrender.com/api/juan/GASTO_ID \
  -H "Content-Type: application/json" \
  -d '{"descripcion":"Cena","cantidad":30,"categoria":"Alimentación"}'
```

**Eliminar un gasto:**
```bash
curl -X DELETE https://gestion-presupuesto-api.onrender.com/api/juan/GASTO_ID
```

## Variables de entorno

- `MONGODB_URI`: Conexión a MongoDB (obligatoria)
- `PORT`: Puerto (por defecto 3000)
- `NODE_ENV`: `production` o `development`

## ✅ CORS habilitado

La API permite requests desde cualquier origen. Puedes cambiar esto en `server.js`:

```javascript
// Permitir todos los orígenes
app.use(cors());

// O ser más restrictivo:
app.use(cors({
  origin: 'https://tu-dominio.com'
}));
```

## Health Check

Para verificar que la API está funcionando:
```bash
curl https://gestion-presupuesto-api.onrender.com/health
```

Deberías recibir:
```json
{"status":"✅ API funcionando correctamente"}
```
