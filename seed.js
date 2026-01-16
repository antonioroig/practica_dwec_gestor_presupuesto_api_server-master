const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Conectar a MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gestionPresupuesto';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1);
  });

// Esquema de Gasto
const gastoSchema = new mongoose.Schema({
  usuario: {
    type: String,
    required: true,
    index: true
  },
  gastoId: {
    type: String,
    required: true,
    default: () => uuidv4()
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
    type: Date,
    default: Date.now
  },
  categoria: {
    type: String,
    enum: ['Alimentación', 'Transporte', 'Entretenimiento', 'Salud', 'Vivienda', 'Otros'],
    default: 'Otros'
  }
}, { timestamps: true });

gastoSchema.index({ usuario: 1, gastoId: 1 }, { unique: true });

const Gasto = mongoose.model('Gasto', gastoSchema);

// Datos de ejemplo
const gastosEjemplo = [
  {
    usuario: 'juan',
    descripcion: 'Café en la cafetería',
    valor: 3.50,
    etiquetas: ['café', 'desayuno'],
    categoria: 'Alimentación',
    fecha: new Date('2025-01-15')
  },
  {
    usuario: 'juan',
    descripcion: 'Gasolina',
    valor: 45.00,
    etiquetas: ['coche', 'combustible'],
    categoria: 'Transporte',
    fecha: new Date('2025-01-14')
  },
  {
    usuario: 'juan',
    descripcion: 'Entrada cine',
    valor: 12.50,
    etiquetas: ['cine', 'películas'],
    categoria: 'Entretenimiento',
    fecha: new Date('2025-01-13')
  },
  {
    usuario: 'juan',
    descripcion: 'Farmacia - Medicinas',
    valor: 28.30,
    etiquetas: ['medicina', 'farmacia'],
    categoria: 'Salud',
    fecha: new Date('2025-01-12')
  },
  {
    usuario: 'juan',
    descripcion: 'Comida en restaurante',
    valor: 25.80,
    etiquetas: ['restaurante', 'cena'],
    categoria: 'Alimentación',
    fecha: new Date('2025-01-11')
  },
  {
    usuario: 'juan',
    descripcion: 'Pago rent mes',
    valor: 800.00,
    etiquetas: ['vivienda', 'alquiler'],
    categoria: 'Vivienda',
    fecha: new Date('2025-01-10')
  },
  {
    usuario: 'maria',
    descripcion: 'Compra ropa',
    valor: 65.00,
    etiquetas: ['ropa', 'compras'],
    categoria: 'Otros',
    fecha: new Date('2025-01-15')
  },
  {
    usuario: 'maria',
    descripcion: 'Uber a casa',
    valor: 18.50,
    etiquetas: ['taxi', 'transporte'],
    categoria: 'Transporte',
    fecha: new Date('2025-01-14')
  }
];

async function seedDatabase() {
  try {
    // Limpiar datos existentes
    await Gasto.deleteMany({});
    console.log('🗑️  Base de datos limpiada');

    // Insertar datos de ejemplo
    const resultado = await Gasto.insertMany(
      gastosEjemplo.map(gasto => ({
        ...gasto,
        gastoId: uuidv4()
      }))
    );

    console.log(`✅ ${resultado.length} gastos insertados correctamente`);
    console.log('\n📊 Gastos cargados:');
    console.log('   - Usuario "juan": 6 gastos');
    console.log('   - Usuario "maria": 2 gastos');
    console.log('\n🔗 Prueba la API en:');
    console.log('   GET http://localhost:3000/api/juan');
    console.log('   GET http://localhost:3000/api/maria');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error cargando datos:', error);
    process.exit(1);
  }
}

seedDatabase();
