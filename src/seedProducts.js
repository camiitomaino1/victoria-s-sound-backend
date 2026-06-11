import sequelize from './db.js'
import Product from './models/Product.js'

const products = [
  // Guitarras
  {
    nombre: 'Stratocaster Player Series',
    marca: 'Fender',
    categoria: 'Guitarras',
    precio: 1500,
    descripcion: 'Guitarra eléctrica de cuerpo sólido con 3 micrófonos simples.'
  },
  {
    nombre: 'Les Paul Standard',
    marca: 'Gibson',
    categoria: 'Guitarras',
    precio: 2800,
    descripcion: 'Guitarra eléctrica con tapa de arce flameado y micrófonos humbucker.'
  },
  {
    nombre: 'Dreadnought D-28',
    marca: 'Martin',
    categoria: 'Guitarras',
    precio: 3200,
    descripcion: 'Guitarra acústica con tapa de abeto Sitka y aros de palisandro.'
  },
  {
    nombre: 'Talman TC135',
    marca: 'Ibanez',
    categoria: 'Guitarras',
    precio: 750,
    descripcion: 'Guitarra semiacústica ideal para jazz y blues.'
  },
  // Bajos
  {
    nombre: 'Jazz Bass Player Series',
    marca: 'Fender',
    categoria: 'Bajos',
    precio: 1400,
    descripcion: 'Bajo eléctrico de 4 cuerdas con dos micrófonos de bobina simple.'
  },
  {
    nombre: 'StingRay 4',
    marca: 'Music Man',
    categoria: 'Bajos',
    precio: 2200,
    descripcion: 'Bajo activo de 4 cuerdas con micrófono humbucker y ecualizador de 2 bandas.'
  },
  {
    nombre: 'Thunderbird IV',
    marca: 'Gibson',
    categoria: 'Bajos',
    precio: 1900,
    descripcion: 'Bajo eléctrico de cuerpo through-neck con sonido potente y grave.'
  },
  // Teclados
  {
    nombre: 'JUNO-DS61',
    marca: 'Roland',
    categoria: 'Teclados',
    precio: 1800,
    descripcion: 'Sintetizador portátil de 61 teclas con 128 voces polifónicas.'
  },
  {
    nombre: 'MX61',
    marca: 'Yamaha',
    categoria: 'Teclados',
    precio: 1600,
    descripcion: 'Teclado sintetizador de 61 teclas con conectividad DAW integrada.'
  },
  {
    nombre: 'FP-30X',
    marca: 'Roland',
    categoria: 'Teclados',
    precio: 2400,
    descripcion: 'Piano digital de 88 teclas con acción de martillo y sonido de cola.'
  },
  // Baterías
  {
    nombre: 'Stage Custom Birch',
    marca: 'Yamaha',
    categoria: 'Baterías',
    precio: 3000,
    descripcion: 'Batería acústica de 5 piezas con cascos de abedul.'
  },
  {
    nombre: 'Imperialstar',
    marca: 'Tama',
    categoria: 'Baterías',
    precio: 2200,
    descripcion: 'Kit de batería completo de 5 piezas con platillos incluidos.'
  },
  // Violines
  {
    nombre: 'Student Violin 4/4',
    marca: 'Stentor',
    categoria: 'Violines',
    precio: 900,
    descripcion: 'Violín de estudio con tapa de abeto y arco de madera de brasil.'
  },
  {
    nombre: 'Conservatory Violin 4/4',
    marca: 'Cremona',
    categoria: 'Violines',
    precio: 1500,
    descripcion: 'Violín de nivel intermedio con tapa maciza y barniz artesanal.'
  },
  // Accesorios
  {
    nombre: 'Afinador Cromático TU-3',
    marca: 'Boss',
    categoria: 'Accesorios',
    precio: 120,
    descripcion: 'Pedal afinador cromático con salida bypass y soporte para bajo.'
  },
  {
    nombre: 'Correa Levy\'s 3 pulgadas',
    marca: 'Levy\'s',
    categoria: 'Accesorios',
    precio: 85,
    descripcion: 'Correa de cuero genuino para guitarra o bajo con largo ajustable.'
  }
]

// Connect to the database, sync the model and insert the products
const seed = async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connected successfully')

    // Sync without force to preserve existing table structure
    await sequelize.sync()
    console.log('Models synchronized successfully')

    // Insert all products into the database
    await Product.bulkCreate(products)
    console.log(`${products.length} products inserted successfully`)

    process.exit(0)
  } catch (error) {
    console.error('Error running seed:', error)
    process.exit(1)
  }
}

seed()