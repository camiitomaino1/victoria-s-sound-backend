import sequelize from './db.js'
import Product from './models/Product.js'

const products = [
  // Guitarras
  {
    nombre: 'Stratocaster Player Series',
    marca: 'Fender',
    categoria: 'Guitarras',
    precio: 1500,
    descripcion: 'Guitarra eléctrica de cuerpo sólido con 3 micrófonos simples.',
    imagen: "https://dcdn-us.mitiendanube.com/stores/001/040/912/products/014-4502-5001-b323e79bbfc7f233c615981106592656-1024-1024.webp"
  },
  {
    nombre: 'Les Paul Standard',
    marca: 'Gibson',
    categoria: 'Guitarras',
    precio: 2800,
    descripcion: 'Guitarra eléctrica con tapa de arce flameado y micrófonos humbucker.',
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQo7cT9IolL3MsgUZBDuBgd1YFu5bNNg62AHg&s"
  },
  {
    nombre: 'Dreadnought D-28',
    marca: 'Martin',
    categoria: 'Guitarras',
    precio: 3200,
    descripcion: 'Guitarra acústica con tapa de abeto Sitka y aros de palisandro.',
    imagen: "https://r2.gear4music.com/media/41/419498/600/preview.jpg"
  },
  {
    nombre: 'Talman TC135',
    marca: 'Ibanez',
    categoria: 'Guitarras',
    precio: 750,
    descripcion: 'Guitarra semiacústica ideal para jazz y blues.',
    imagen: "https://r2.gear4music.com/media/66/667301/215/preview.jpg"
  },
  // Bajos
  {
    nombre: 'Jazz Bass Player Series',
    marca: 'Fender',
    categoria: 'Bajos',
    precio: 1400,
    descripcion: 'Bajo eléctrico de 4 cuerdas con dos micrófonos de bobina simple.',
    imagen: "https://dcdn-us.mitiendanube.com/stores/001/040/912/products/011-1660-3001-fc0cb66e969372c86815981107825056-1024-1024.webp"
  },
  {
    nombre: 'StingRay 4',
    marca: 'Music Man',
    categoria: 'Bajos',
    precio: 2200,
    descripcion: 'Bajo activo de 4 cuerdas con micrófono humbucker y ecualizador de 2 bandas.',
    imagen: "https://m.media-amazon.com/images/I/51AFpA55YTL.jpg"
  },
  {
    nombre: 'Thunderbird IV',
    marca: 'Gibson',
    categoria: 'Bajos',
    precio: 1900,
    descripcion: 'Bajo eléctrico de cuerpo through-neck con sonido potente y grave.',
    imagen: "https://http2.mlstatic.com/D_NQ_NP_866023-MLA99898043397_112025-O.webp"
  },
  // Teclados
  {
    nombre: 'JUNO-DS61',
    marca: 'Roland',
    categoria: 'Teclados',
    precio: 1800,
    descripcion: 'Sintetizador portátil de 61 teclas con 128 voces polifónicas.',
    imagen: "https://http2.mlstatic.com/D_NQ_NP_740179-MLA27405038697_052018-O.webp"
  },
  {
    nombre: 'MX61',
    marca: 'Yamaha',
    categoria: 'Teclados',
    precio: 1600,
    descripcion: 'Teclado sintetizador de 61 teclas con conectividad DAW integrada.',
    imagen: "https://tiendafeedback.com.ar/66688-large_default/sintetizador-yamaha-mx61bk.jpg"
  },
  {
    nombre: 'FP-30X',
    marca: 'Roland',
    categoria: 'Teclados',
    precio: 2400,
    descripcion: 'Piano digital de 88 teclas con acción de martillo y sonido de cola.',
    imagen: "https://http2.mlstatic.com/D_NQ_NP_680974-MLU71757720909_092023-O.webp"
  },
  // Baterías
  {
    nombre: 'Stage Custom Birch',
    marca: 'Yamaha',
    categoria: 'Baterías',
    precio: 3000,
    descripcion: 'Batería acústica de 5 piezas con cascos de abedul.',
    imagen: "https://ecomusicweb.com/wp-content/uploads/2018/09/SBP0F5HA-scaled.webp"
  },
  {
    nombre: 'Imperialstar',
    marca: 'Tama',
    categoria: 'Baterías',
    precio: 2200,
    descripcion: 'Kit de batería completo de 5 piezas con platillos incluidos.',
    imagen: "https://http2.mlstatic.com/D_NQ_NP_867710-MLA102269152750_122025-O.webp"
  },
  // Violines
  {
    nombre: 'Student Violin 4/4',
    marca: 'Stentor',
    categoria: 'Violines',
    precio: 900,
    descripcion: 'Violín de estudio con tapa de abeto y arco de madera de brasil.',
    imagen: "https://www.opus2galway.ie/wp-content/uploads/2021/02/gear1-2.jpg"
  },
  {
    nombre: 'Conservatory Violin 4/4',
    marca: 'Cremona',
    categoria: 'Violines',
    precio: 1500,
    descripcion: 'Violín de nivel intermedio con tapa maciza y barniz artesanal.',
    imagen: "https://heavenstorage.blob.core.windows.net/storageheavenimagenes/b23e72e1-40ba-4adb-9dc3-7ee3d3a63b35/images/v2/CREMONA/27831_xlarge.jpg?sp=r&st=2025-06-19T02:11:26Z&se=2035-06-19T10:11:26Z&spr=https&sv=2024-11-04&sr=c&sig=JTrpEXutEZPdfvCaeQXMhkVlHyRxzKHHZRKwJAxxoq8%3D"
  },
  // Accesorios
  {
    nombre: 'Afinador Cromático TU-3',
    marca: 'Boss',
    categoria: 'Accesorios',
    precio: 120,
    descripcion: 'Pedal afinador cromático con salida bypass y soporte para bajo.',
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGD1axulUzEF13quY841K4lhauAJ1Vhw266g&s"
  },
  {
    nombre: 'Correa Levy\'s 3 pulgadas',
    marca: 'Levy\'s',
    categoria: 'Accesorios',
    precio: 85,
    descripcion: 'Correa de cuero genuino para guitarra o bajo con largo ajustable.',
    imagen: "https://http2.mlstatic.com/D_NQ_NP_674528-CBT109549026024_042026-O.webp"
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

    // Delete all existing products before inserting new ones
    await Product.destroy({ where: {} })
    console.log('Existing products deleted')

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