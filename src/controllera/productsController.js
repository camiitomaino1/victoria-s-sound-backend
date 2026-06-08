// Hardcoded products array (will be replaced by database queries later)
const products = [
    {
      id: 1,
      nombre: 'Guitarra Eléctrica Stratocaster',
      categoria: 'Guitarras',
      precio: 1500,
      descripcion: 'Guitarra eléctrica de cuerpo sólido, ideal para rock y blues.'
    },
    {
      id: 2,
      nombre: 'Guitarra Acústica Dreadnought',
      categoria: 'Guitarras',
      precio: 800,
      descripcion: 'Guitarra acústica de tapa de abeto macizo.'
    },
    {
      id: 3,
      nombre: 'Bajo Eléctrico Jazz Bass',
      categoria: 'Bajos',
      precio: 1200,
      descripcion: 'Bajo eléctrico de 4 cuerdas con sonido versátil.'
    },
    {
      id: 4,
      nombre: 'Bajo Acústico Semi-Resonante',
      categoria: 'Bajos',
      precio: 950,
      descripcion: 'Bajo acústico con cuerpo semi-resonante y tapa de cedro.'
    },
    {
      id: 5,
      nombre: 'Teclado Sintetizador 61 Teclas',
      categoria: 'Teclados',
      precio: 2000,
      descripcion: 'Sintetizador profesional con 500 sonidos y conectividad MIDI.'
    },
    {
      id: 6,
      nombre: 'Piano Digital 88 Teclas',
      categoria: 'Teclados',
      precio: 3500,
      descripcion: 'Piano digital con teclas contrapesadas y muestreo de cola.'
    },
    {
      id: 7,
      nombre: 'Batería Acústica 5 Piezas',
      categoria: 'Baterías',
      precio: 2800,
      descripcion: 'Kit completo con bombo, caja, toms y platillos.'
    },
    {
      id: 8,
      nombre: 'Violín 4/4 Profesional',
      categoria: 'Violines',
      precio: 1800,
      descripcion: 'Violín de tamaño completo con estuche, arco y resina.'
    }
  ]
  
  // GET /api/products → returns all products
  const getProducts = (req, res) => {
    res.json(products)
  }
  
  module.exports = {
    getProducts
  }