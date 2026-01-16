const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Variables globales
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gestionPresupuesto';
const USE_FILE_STORAGE = process.env.USE_FILE_STORAGE === 'true' || !process.env.MONGODB_URI;
const DATA_FILE = path.join(__dirname, 'gastos.json');

let gastos = [];

// Función para cargar datos del archivo
function cargarDatos() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const datos = fs.readFileSync(DATA_FILE, 'utf-8');
      gastos = JSON.parse(datos);
      console.log('✅ Datos cargados del archivo');
    } else {
      gastos = [];
      console.log('📝 Archivo de datos no encontrado, iniciando con datos vacíos');
    }
  } catch (error) {
    console.error('⚠️  Error cargando datos:', error.message);
    gastos = [];
  }
}

// Función para guardar datos en archivo
function guardarDatos() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(gastos, null, 2));
  } catch (error) {
    console.error('⚠️  Error guardando datos:', error.message);
  }
}

// Conectar a MongoDB (opcional)
if (!USE_FILE_STORAGE) {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('✅ Conectado a MongoDB');
      cargarDatos();
    })
    .catch(err => {
      console.warn('⚠️  Usando almacenamiento en archivo JSON en lugar de MongoDB');
      cargarDatos();
    });
} else {
  console.log('💾 Usando almacenamiento en archivo JSON (gastos.json)');
  cargarDatos();
}

// Esquema de Gasto (para referencia)
const gastoSchema = new mongoose.Schema({
  usuario: {
    type: String,
    required: true,
    index: true
  },
  gastoId: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  valor: {
    type: Number,
    required: true,
    min: 0
  },
  etiquetas: [{
    type: String
  }],
  fecha: {
    type: String,
    required: true
  }
}, { timestamps: false });

// ==================== RUTAS ====================

// GET: Obtener todos los gastos de un usuario
app.get('/api/:usuario', async (req, res) => {
  try {
    const { usuario } = req.params;
    const gastosUsuario = gastos.filter(g => g.usuario === usuario);
    res.json(gastosUsuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Obtener un gasto específico
app.get('/api/:usuario/:gastoId', async (req, res) => {
  try {
    const { usuario, gastoId } = req.params;
    const gasto = gastos.find(g => g.usuario === usuario && g.gastoId === gastoId);
    
    if (!gasto) {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }
    res.json(gasto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Crear un nuevo gasto
app.post('/api/:usuario', async (req, res) => {
  try {
    const { usuario } = req.params;
    const data = req.body;
    
    // Validar campos requeridos
    if (!data.descripcion || data.valor === undefined || !data.fecha) {
      return res.status(400).json({ 
        error: 'Se requieren los campos: descripcion, valor, fecha' 
      });
    }
    
    const nuevoGasto = {
      ...data,
      usuario,
      gastoId: uuidv4(),
      etiquetas: data.etiquetas || []
    };
    
    gastos.push(nuevoGasto);
    guardarDatos();
    
    res.status(201).json(nuevoGasto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT: Actualizar un gasto
app.put('/api/:usuario/:gastoId', async (req, res) => {
  try {
    const { usuario, gastoId } = req.params;
    const data = req.body;
    
    const indice = gastos.findIndex(g => g.usuario === usuario && g.gastoId === gastoId);
    
    if (indice === -1) {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }
    
    gastos[indice] = {
      ...gastos[indice],
      ...data,
      usuario,
      gastoId
    };
    
    guardarDatos();
    res.json(gastos[indice]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Eliminar un gasto
app.delete('/api/:usuario/:gastoId', async (req, res) => {
  try {
    const { usuario, gastoId } = req.params;
    
    const indice = gastos.findIndex(g => g.usuario === usuario && g.gastoId === gastoId);
    
    if (indice === -1) {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }
    
    const gastoEliminado = gastos.splice(indice, 1)[0];
    guardarDatos();
    
    res.json({ message: 'Gasto eliminado', gasto: gastoEliminado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: '✅ API funcionando correctamente',
    storage: USE_FILE_STORAGE ? 'archivo JSON' : 'MongoDB',
    gastosTotal: gastos.length
  });
});

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`💾 Almacenamiento: ${USE_FILE_STORAGE ? 'Archivo JSON' : 'MongoDB'}`);
});

module.exports = app;
