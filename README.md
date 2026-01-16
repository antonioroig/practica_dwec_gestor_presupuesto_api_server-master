# 📱 API Gestión de Presupuesto - Express + MongoDB

API REST para gestionar gastos por usuario. Refactorizada desde Claudia/DynamoDB a Express/MongoDB para mayor facilidad de despliegue.

## 🚀 Características

- ✅ CORS habilitado
- ✅ Gestión CRUD completa de gastos
- ✅ Almacenamiento flexible (archivo JSON local o MongoDB)
- ✅ Fácil despliegue en Render.com
- ✅ Sin costos (100% gratuito)

## 📋 Estructura de un Gasto

```json
{
  "usuario": "juan",
  "gastoId": "550e8400-e29b-41d4-a716-446655440001",
  "descripcion": "Café en la cafetería",
  "valor": 3.50,
  "etiquetas": ["café", "desayuno"],
  "fecha": "2025-01-15"
}
```

**Campos requeridos:**
- `descripcion` (string)
- `valor` (number)
- `fecha` (string en formato "YYYY-MM-DD")
- `etiquetas` (array de strings, opcional)

## 🔌 Rutas API

### GET - Obtener todos los gastos de un usuario
```bash
GET /api/:usuario
```

**Ejemplo:**
```bash
curl http://localhost:3000/api/juan
```

**Respuesta:**
```json
[
  {
    "usuario": "juan",
    "gastoId": "550e8400-e29b-41d4-a716-446655440001",
    "descripcion": "Café",
    "valor": 3.50,
    "etiquetas": ["café"],
    "fecha": "2025-01-15"
  }
]
```

### GET - Obtener un gasto específico
```bash
GET /api/:usuario/:gastoId
```

### POST - Crear un nuevo gasto
```bash
POST /api/:usuario
Content-Type: application/json

{
  "descripcion": "Comida",
  "valor": 25.50,
  "etiquetas": ["restaurante"],
  "fecha": "2025-01-16"
}
```

### PUT - Actualizar un gasto
```bash
PUT /api/:usuario/:gastoId
Content-Type: application/json

{
  "descripcion": "Comida - Actualizado",
  "valor": 28.00,
  "etiquetas": ["restaurante", "cena"],
  "fecha": "2025-01-16"
}
```

### DELETE - Eliminar un gasto
```bash
DELETE /api/:usuario/:gastoId
```

## 🏃 Usar Localmente

### Instalación
```bash
npm install
```

### Ejecutar servidor
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

### Datos de ejemplo
Ya hay datos precargados en `gastos.json` para usuarios `juan` y `maria`.

## 📦 Desplegar en Render.com

### 1. MongoDB Atlas (Base de datos gratuita)
1. Ve a [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Crea cuenta y un cluster M0 (gratuito)
3. Obtén la connection string

### 2. GitHub
```bash
git push origin main
```

### 3. Render.com
1. Entra en [render.com](https://render.com)
2. Crea un "Web Service"
3. Configura:
   - **Build**: `npm install`
   - **Start**: `node server.js`
   - **Variable de entorno**: `MONGODB_URI=tu_connection_string`
4. Deploy

## 🔧 Configuración

### Variables de entorno (`.env`)
```env
MONGODB_URI=mongodb://localhost:27017/gestionPresupuesto
PORT=3000
NODE_ENV=development
```

**⚠️ IMPORTANTE - Seguridad:**
- **NO subas el archivo `.env` a GitHub** - Contiene credenciales sensibles
- Copia `.env.example` a `.env` para desarrollo local
- El archivo `.env` está en `.gitignore` y no será trackeado por Git
- En producción (Render.com), configura las variables de entorno desde el dashboard

### Almacenamiento
- **Archivo JSON** (por defecto): Perfectamente funcional para desarrollo/pruebas
- **MongoDB**: Ideal para producción

## ✅ Health Check
```bash
curl http://localhost:3000/health
```

## 📝 Notas
- Los cambios en los gastos se guardan automáticamente en `gastos.json`
- No hay campos `categoria`, `createdAt` o `updatedAt` para mantener compatibilidad con el original
- El orden de las propiedades en JSON no afecta al funcionamiento
