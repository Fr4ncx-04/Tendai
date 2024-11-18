const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const router = express.Router();
require('dotenv').config();
const path = require('path');

const app = express();

// Configuración de la base de datos
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

const db = mysql.createPool(dbConfig);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Ruta base
app.get('/', (req, res) => {
    res.status(200).send('Bienvenido a la API.');
});

// Registro de usuario
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Verificar que todos los campos requeridos están presentes
  if (!username || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // Verificar que el email tenga @gmail.com
  if (!email.endsWith('@gmail.com')) {
      return res.status(400).json({ message: 'El correo debe ser de Gmail' });
  }

  // Cifrar la contraseña
  bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
          console.error("Error al cifrar la contraseña:", err);
          return res.status(500).json({ message: 'Error al cifrar la contraseña' });
      }

      // Construir la consulta para insertar un usuario
      const query = 'INSERT INTO usuarios (usuario, email, password, accountType) VALUES (?, ?, ?, ?)';
      const values = [username, email, hashedPassword, 'user'];

      // Ejecutar la consulta
      db.query(query, values, (err, result) => {
          if (err) {
              console.error("Error en la inserción de datos:", err);
              return res.status(500).json({ message: 'Error al registrar el usuario' });
          }
          res.status(201).json({ message: 'Usuario registrado exitosamente' });
      });
  });
});

// Login
app.post('/login', (req, res) => {
  const { usuario, password, accountType } = req.body;

  // Verificar que todos los campos requeridos están presentes
  if (!usuario || !password || !accountType) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  // Verificar tipo de cuenta
  if (!['user', 'company', 'admin'].includes(accountType)) {
      return res.status(400).json({ message: 'Tipo de cuenta no válido' });
  }

  // Construir la consulta según el tipo de cuenta
  let query;
  if (accountType === 'user') {
      query = 'SELECT * FROM usuarios WHERE usuario = ?';
  } else if (accountType === 'company') {
      query = 'SELECT * FROM empresas WHERE nombre_empresa = ?';
  } else if (accountType === 'admin') {
      query = 'SELECT * FROM administradores WHERE nombre_admin = ?'; 
  }

  // Ejecutar la consulta
  db.query(query, [usuario], (err, result) => {
      if (err) {
          console.error("Error en la consulta:", err);
          return res.status(500).json({ message: 'Error en la consulta' });
      }
      if (result.length === 0) {
          return res.status(401).json({ message: 'Usuario no encontrado' });
      }

      const user = result[0];

      // Comparar la contraseña ingresada con la almacenada
      bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
              console.error("Error al comparar contraseñas:", err);
              return res.status(500).json({ message: 'Error al comparar contraseñas' });
          }
          if (!isMatch) {
              return res.status(401).json({ message: 'Contraseña incorrecta' });
          }

          // Ahora incluimos el id_usuario en la respuesta
          res.status(200).json({
              message: 'Inicio de sesión exitoso',
              id_usuario: user.id_usuario,
          });
      });
  });
});


// Obtener productos
app.get('/productos', (req, res) => {
  db.getConnection((err, connection) => {
      if (err) {
          console.error("Error al conectar a la base de datos:", err);
          return res.status(500).json({ message: 'Error al conectar a la base de datos' });
      } 
      
      connection.query(
          `SELECT p.id_producto, p.nombre, p.descripcion, p.precio, p.stock, p.imagen, 
          p.nombre_categoria AS categoria, p.nombre_marca AS marca, 
          AVG(r.calificacion) AS promedio_calificacion 
          FROM vista_productos p 
          LEFT JOIN resena r ON p.id_producto = r.id_producto 
          GROUP BY p.id_producto;`,
          (error, results) => {
              connection.release();
              if (error) {
                  console.error("Error en la consulta de productos:", error);
                  return res.status(500).json({ message: 'Error al obtener los productos' });
              }
              
              // Formatear los resultados
              const formattedResults = results.map(product => ({
                  id: product.id_producto,
                  name: product.nombre,
                  description: product.descripcion,
                  price: product.precio,
                  stock: product.stock,
                  image: `http://localhost:3001/images/products/${product.imagen}`,
                  brand: product.marca,
                  category: product.categoria,
                  averageRating: product.promedio_calificacion 
              }));
              res.status(200).json(formattedResults);
          }
      );
  });
});


app.get('/detalle-producto/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      vp.id_producto, 
      vp.nombre, 
      vp.descripcion, 
      vp.precio, 
      vp.stock, 
      vp.imagen, 
      vp.nombre_categoria AS categoria, 
      vp.nombre_marca AS marca,
      e.procesador,
      e.ram_gb,
      e.almacenamiento,
      e.pantalla,
      e.grafica,
      e.bateria,
      e.peso,
      e.hdmi,
      e.lectorSD,
      e.wifi,
      e.bluetooth,
      e.sistema_operativo,
      e.puertos,
      e.garantia,
      AVG(r.calificacion) AS promedio_calificacion
    FROM vista_productos vp
    LEFT JOIN especificaciones e ON vp.id_producto = e.id_producto
    LEFT JOIN resena r ON vp.id_producto = r.id_producto
    WHERE vp.id_producto = ?
    GROUP BY vp.id_producto;
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener los detalles del producto.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    const product = results[0];
    const formattedProduct = {
      id: product.id_producto,
      name: product.nombre,
      description: product.descripcion,
      price: product.precio,
      stock: product.stock,
      image: `http://localhost:3001/images/products/${product.imagen}`,
      brand: product.marca,
      category: product.categoria,
      averageRating: product.promedio_calificacion || 0,
      specs: {
        processor: product.procesador,
        ram: product.ram_gb,
        storage: product.almacenamiento,
        display: product.pantalla,
        graphics: product.grafica,
        battery: product.bateria,
        weight: product.peso,
        hdmi: product.hdmi,
        sdCardReader: product.lectorSD,
        wifi: product.wifi,
        bluetooth: product.bluetooth,
        os: product.sistema_operativo,
        ports: product.puertos,
        warranty: product.garantia
      }
    };

    res.status(200).json(formattedProduct);
  });
});


// Endpoint para enviar reseñas
app.post('/send-reviews', async (req, res) => {
  console.log('Datos recibidos:', req.body);
  const { userId, numericId, comment, rating } = req.body; 

  // Validar los datos
  if ( !userId || !numericId || !comment || !rating) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  const query = 'INSERT INTO resena (id_usuario, id_producto, resena, calificacion, date) VALUES (?, ?, ?, ?, NOW())';
  const values = [userId, numericId, comment, rating]; 

  // Ejecutar la consulta
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al enviar la resena:", err);
      return res.status(500).json({ message: 'Ocurrió un error al enviar la resena' });
    }

    if (result.affectedRows > 0) {
      const newReviewId = result.insertId;
      return res.status(201).json({
        id: newReviewId,
        userId,
        numericId, 
        comment,
        rating,
        date: new Date().toISOString(),
      });
      
    } if (!response.ok) {
      const errorResponse = response.json();
      console.error('Error adding review:', response.statusText, errorResponse);
    }
    else {
      console.error("No se pudo insertar la resena");
      return res.status(500).json({ message: 'Error al insertar la resena' });
    }
  });
});

  // Endpoint para obtener reseñas por id de producto
  app.get('/get-reviews/:id', (req, res) => {
    const { id } = req.params;
    const query = `
      SELECT 
        id_resena, 
        resena, 
        calificacion, 
        date, 
        usuario, 
        id_producto, 
        nombre 
      FROM vista_resenas 
      WHERE id_producto = ?
    `;
  
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error al obtener reseñas:', err);
        return res.status(500).json({ message: 'Error al obtener reseñas.' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'No se encontraron reseñas para este producto.' });
      }
  
      // Formatear las reseñas si es necesario
      const formattedReviews = results.map(review => ({
        id: review.id_resena,
        comment: review.resena,
        rating: review.calificacion,
        date: review.date,
        user: review.usuario,
        numericId: review.id_producto,
        productName: review.nombre
      }));
  
      res.status(200).json(formattedReviews);
    });
  });  

// Ruta para agregar un producto al carrito
app.post('/add-to-cart', (req, res) => {
  const { id_usuario, id_producto, cantidad, tipo_pago, meses } = req.body;

  // Validar la entrada
  if (!id_usuario || !id_producto || !cantidad || !tipo_pago || (meses === undefined)) {
    return res.status(400).send({ message: 'Todos los campos son obligatorios' });
  }

  // Consulta SQL para insertar el producto en el carrito
  const sql = 'INSERT INTO carrito (id_usuario, id_producto, Cantidad, tipo_pago, meses) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [id_usuario, id_producto, cantidad, tipo_pago, meses], (err, result) => {
    if (err) {
      console.error('Error al agregar al carrito: ', err);
      return res.status(500).send({ message: 'Error al agregar al carrito', error: err.message });
    }

    // Verificar si se insertó correctamente
    if (result.affectedRows === 0) {
      return res.status(500).send({ message: 'No se pudo agregar el producto al carrito' });
    }

    res.status(201).send({ message: 'Producto agregado al carrito', id_carrito: result.insertId });
  });
});

// Endpoint para obtener los elementos del carrito por id_usuario
app.get('/cart-items/:userId', (req, res) => {
  const userId = req.params.userId;

  const query = `
    SELECT id_usuario, id_carrito, nombre , imagen , 
          precio , cantidad , tipo_pago, meses
    FROM vista_carrito
    WHERE id_usuario = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error al obtener datos del carrito:', err);
      return res.status(500).json({ error: 'Error en la consulta' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'No existe un carrito para mostrar' });
    }

    // Formatear las reseñas si es necesario
    const formattedCart = results.map(cart => ({
      id_usuario: cart.id_usuario,
      id_carrito: cart.id_carrito,
      name: cart.nombre,
      image: `http://localhost:3001/images/products/${cart.imagen}`,
      price: cart.precio,
      quantity: cart.cantidad,
      tipo_pago: cart.tipo_pago,
      months: cart.meses
    }));

    res.status(200).json(formattedCart);
  });
});

// Endpoint para obtener la cantidad de artículos en el carrito
app.get('/cart-count', (req, res) => {
  const userId = req.headers['id_usuario'];

  if (!userId) {
    return res.status(400).json({ message: 'id_usuario es requerido en los headers' });
  }

  // Consulta para sumar las cantidades de los ítems en el carrito
  const query = `
    SELECT SUM(Cantidad) as total_count 
    FROM carrito 
    WHERE id_usuario = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error al obtener la cantidad del carrito:', err);
      return res.status(500).json({ error: 'Error en la consulta' });
    }

    // Devolver la cantidad total (si no hay resultados, asumimos que es 0)
    const count = results[0].total_count || 0;
    res.status(200).json({ count });
  });
});

// Endpoint para actualizar la cantidad de un ítem en el carrito
app.patch('/update-cart-item/:id_carrito', (req, res) => {
  const idCarrito = req.params.id_carrito;
  const { quantity } = req.body;

  if (quantity <= 0) {
    return res.status(400).json({ error: 'La cantidad debe ser mayor que cero' });
  }

  const query = `UPDATE carrito SET cantidad = ? WHERE id_carrito = ?`;

  db.query(query, [quantity, idCarrito], (err, results) => {
    if (err) {
      console.error('Error al actualizar la cantidad del producto en el carrito:', err);
      return res.status(500).json({ error: 'Error en la consulta' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    res.status(200).json({ message: 'Cantidad del producto actualizada correctamente' });
  });
});


// Endpoint para eliminar un ítem del carrito por id_carrito
app.delete('/delete-cart-item/:id_carrito', (req, res) => {
  const idCarrito = req.params.id_carrito;

  const query = `DELETE FROM carrito WHERE id_carrito = ?`;

  db.query(query, [idCarrito], (err, results) => {
    if (err) {
      console.error('Error al eliminar el producto del carrito:', err);
      return res.status(500).json({ error: 'Error en la consulta' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    res.status(200).json({ message: 'Producto eliminado del carrito correctamente' });
  });
});

app.delete('/clear-cart/:id_usuario', (req,res) => {
  const idUsuario = req.params.id_usuario;

  const query = `DELETE FROM carrito WHERE id_usuario = ?`;

  db.query(query, [idUsuario], (err, results) => {
    if (err) {
      console.error('Error al eliminar el producto del carrito:', err);
      return res.status(500).json({ error: 'Error en la consulta' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    res.status(200).json({ message: 'Carrito eliminado correctamente' });
  });
})

app.post('/datos_usuario', (req, res) => {
  const { id_usuario, Telefono, direccion, codigo_postal } = req.body;

  const query = 'INSERT INTO datos_usuario (id_usuario, Telefono, direccion, codigo_postal) VALUES (?, ?, ?, ?)';
  db.query(query, [id_usuario, Telefono, direccion, codigo_postal], (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'Datos guardados exitosamente', id_datos: results.insertId });
  });
});

// Endpoint para obtener datos del usuario por ID usando la vista
app.get('/datos_usuario/:id_usuario', (req, res) => {
  const id_usuario = req.params.id_usuario;

  const query = `
    SELECT 
      usuario,
      email,
      Telefono,
      direccion,
      codigo_postal
    FROM 
      data_usuario
    WHERE 
      id_usuario = ?`;

  db.query(query, [id_usuario], (err, results) => {
    if (err) {
      console.error('Error al obtener datos del usuario:', err);
      return res.status(500).json({ error: 'Error en la consulta' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const usuario = results[0]; 

    // Enviar el usuario directamente en lugar de un array
    res.status(200).json({
      Usuario: usuario.usuario,
      Correo: usuario.email,
      Telefono: usuario.telefono,
      Direccion: usuario.direccion,
      Codigo_postal: usuario.codigo_postal
    });
  });
});

// Endpoint para actualizar los datos de usuario en la tabla datos_usuario
app.patch('/api/datos_usuario/:id_usuario', (req, res) => {
  const idUsuario = req.params.id_usuario;
  const { Telefono, direccion, codigo_postal } = req.body;

  if (!Telefono || !direccion || !codigo_postal) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const query = `UPDATE datos_usuario SET Telefono = ?, direccion = ?, codigo_postal = ? WHERE id_usuario = ?`;

  db.query(query, [Telefono, direccion, codigo_postal, idUsuario], (err, results) => {
    if (err) {
      console.error('Error al actualizar los datos del usuario:', err);
      return res.status(500).json({ error: 'Error en la consulta' });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Datos del usuario actualizados correctamente' });
  });
});

// Ruta para crear una nueva membresía
app.post('/membership', (req, res) => {
  const { id_usuario, nombre, color, fecha_inicio, fecha_expiracion } = req.body;

  // Validación de los datos del cuerpo de la solicitud
  if (
    !id_usuario || 
    !nombre ||
    !color ||
    !fecha_inicio ||
    !fecha_expiracion
  ) {
    return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios.' });
  }

  console.log('Datos recibidos en /membership:', req.body);

  const query = `INSERT INTO membresia (id_usuario, nombre, color, fecha_inicio, fecha_expiracion)
                VALUES (?, ?, ?, ?, ?)`;
  
  db.query(query, [id_usuario, nombre, color, fecha_inicio, fecha_expiracion], (err, results) => {
    if (err) {
      console.error('Error al crear la membresía:', err);

      // Manejo específico para errores de clave foránea
      if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ success: false, message: 'El ID de usuario proporcionado no existe.' });
      }

      // Manejo de otros errores
      return res.status(500).json({ success: false, message: 'Error al crear la membresía' });
    }

    res.status(201).json({ 
      success: true,
      message: 'Membresía creada exitosamente',
      id_membresia: results.insertId
    });
  });
});

// Ruta para obtener una membresía por id_usuario
app.get('/membership/:id_usuario', async (req, res) => {
  const { id_usuario } = req.params;

  try {
    db.query(
      `SELECT * FROM membresia WHERE id_usuario = ? ORDER BY fecha_expiracion DESC LIMIT 1`,
      [id_usuario],
      (error, results) => {
        if (error) {
          console.error('Error en la consulta:', error);
          return res.status(500).json({ message: 'Error al obtener la membresía' });
        }

        // Verifica si se encontraron filas
        if (results.length === 0) {
          return res.status(404).json({ message: 'No se encontró membresía para este usuario' });
        }

        // Obtener la primera membresía
        const membership = results[0];

        // Convierte las fechas al formato ISO si es necesario
        membership.fecha_inicio = membership.fecha_inicio.toISOString().split('T')[0];
        membership.fecha_expiracion = membership.fecha_expiracion.toISOString().split('T')[0];

        // Respuesta en el formato deseado
        res.status(200).json({
          ID_Membresia: membership.id_membresia,
          ID_Usuario: id_usuario,
          Nombre: membership.nombre,
          Color: membership.color,
          Fecha_Inicio: membership.fecha_inicio,
          Fecha_Expiracion: membership.fecha_expiracion
        });
      }
    );
  } catch (error) {
    console.error('Error al obtener la membresía:', error);
    res.status(500).json({ message: 'Error al obtener la membresía' });
  }
});

// Ruta para recuperar la contraseña
router.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  if (!email) {
      return res.status(400).json({ message: 'El correo electrónico es requerido.' });
  }

  try {
      // Verificar si el usuario existe en la base de datos
      db.query('SELECT * FROM usuarios WHERE email = ?', [email], (err, results) => {
          if (err) {
              console.error('Error en la consulta:', err);
              return res.status(500).json({ message: 'Error interno en el servidor.' });
          }

          if (results.length === 0) {
              return res.status(404).json({ message: 'Usuario no encontrado.' });
          }

          // Si el usuario existe, obtener la contraseña en texto claro
          const user = results[0]; 

          
          res.json({ password: user.password });

      });
  } catch (error) {
      console.error('Error al recuperar la contraseña:', error);
      res.status(500).json({ message: 'Error al recuperar la contraseña.' });
  }
});

//Ruta para la busqueda
router.get('/search', (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  console.log('Búsqueda realizada con:', q);

  db.query('SELECT * FROM productos WHERE LOWER(nombre) LIKE LOWER(?)', [`%${q}%`], (err, results) => {
    if (err) {
      console.error('Error al realizar la búsqueda:', err);
      return res.status(500).json({ message: 'Error en la búsqueda.' });
    }

    
    res.json({ products: results.length ? results : [] });
  });
});

module.exports = router;

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
