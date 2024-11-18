-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-11-2024 a las 06:36:29
-- Versión del servidor: 10.4.32-MariaDB-log
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tendai`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `id_carrito` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `Cantidad` int(11) NOT NULL,
  `tipo_pago` enum('contado','credito') NOT NULL,
  `meses` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carrito`
--

INSERT INTO `carrito` (`id_carrito`, `id_usuario`, `id_producto`, `Cantidad`, `tipo_pago`, `meses`, `created_at`) VALUES
(1, 1, 1, 1, 'credito', 12, '2024-10-19 20:53:19'),
(2, 1, 2, 1, 'contado', NULL, '2024-10-19 20:53:19'),
(3, 1, 1, 1, 'contado', NULL, '2024-10-29 05:27:50'),
(12, 4, 1, 1, 'contado', NULL, '2024-11-04 04:22:21'),
(15, 3, 1, 2, 'contado', NULL, '2024-11-06 00:19:25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `id_categoria` int(11) NOT NULL,
  `nombre_categoria` varchar(50) DEFAULT NULL,
  `descripcion_categoria` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`id_categoria`, `nombre_categoria`, `descripcion_categoria`) VALUES
(1, 'Business', 'Laptops para negocios'),
(2, 'Gaming', 'Laptops perfectas para el gaming'),
(3, 'Creative', 'Laptops muy creativas'),
(4, 'Ultrabook', 'Laptops ultrabook'),
(5, 'Convertible', 'Laptops convertibles');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `data_usuario`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `data_usuario` (
`id_usuario` int(11)
,`usuario` varchar(255)
,`email` varchar(255)
,`telefono` int(10)
,`direccion` varchar(255)
,`codigo_postal` int(10)
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `datos_usuario`
--

CREATE TABLE `datos_usuario` (
  `id_datos` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `Telefono` int(10) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `codigo_postal` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `datos_usuario`
--

INSERT INTO `datos_usuario` (`id_datos`, `id_usuario`, `Telefono`, `direccion`, `codigo_postal`) VALUES
(15, 5, 1234567890, 'av rosales manzana 72', 35467),
(16, 3, 2147483647, 'calle madero', 56789);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `detalle_producto`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `detalle_producto` (
`id_producto` int(11)
,`nombre` varchar(255)
,`descripcion` text
,`precio` decimal(10,2)
,`imagen` varchar(255)
,`stock` int(10)
,`nombre_marca` varchar(50)
,`nombre_categoria` varchar(50)
,`procesador` varchar(50)
,`ram_gb` varchar(20)
,`almacenamiento` varchar(50)
,`pantalla` varchar(50)
,`grafica` varchar(50)
,`bateria` varchar(50)
,`peso` decimal(5,2)
,`hdmi` varchar(20)
,`lectorSD` varchar(20)
,`wifi` varchar(50)
,`bluetooth` varchar(50)
,`sistema_operativo` varchar(50)
,`puertos` varchar(50)
,`garantia` varchar(20)
);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresas`
--

CREATE TABLE `empresas` (
  `id` int(11) NOT NULL,
  `nombre_empresa` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especificaciones`
--

CREATE TABLE `especificaciones` (
  `id_espec` int(11) NOT NULL,
  `procesador` varchar(50) DEFAULT NULL,
  `ram_gb` varchar(20) DEFAULT NULL,
  `almacenamiento` varchar(50) DEFAULT NULL,
  `pantalla` varchar(50) DEFAULT NULL,
  `grafica` varchar(50) DEFAULT NULL,
  `bateria` varchar(50) DEFAULT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  `hdmi` varchar(20) DEFAULT NULL,
  `lectorSD` varchar(20) DEFAULT NULL,
  `wifi` varchar(50) DEFAULT NULL,
  `bluetooth` varchar(50) DEFAULT NULL,
  `sistema_operativo` varchar(50) DEFAULT NULL,
  `garantia` varchar(20) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `Puertos` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `especificaciones`
--

INSERT INTO `especificaciones` (`id_espec`, `procesador`, `ram_gb`, `almacenamiento`, `pantalla`, `grafica`, `bateria`, `peso`, `hdmi`, `lectorSD`, `wifi`, `bluetooth`, `sistema_operativo`, `garantia`, `id_producto`, `Puertos`) VALUES
(1, 'Intel Core i7-11800H', '16GB DDR4', '512GB NVMe SSD', '15.6\" 4K UHD (3840 x 2160)', 'NVIDIA GeForce RTX 3050 Ti', '86Wh', 1.80, 'no', 'si', 'Wi-Fi 6', '5.1', 'Windows 11 Pro', '1 ano', 1, '2 puertos USB-C Thunderbolt 4, 1 puerto USB-C 3.2 '),
(2, 'Apple M1 Pro', '16GB (M1 Pro)', '512GB SSD', '16.2\" liquid retina XDR (3456 x 2234) hasta 120Hz', 'GPU de 16 nucleos (M1 Pro)', '100Wh', 2.10, 'si', 'si', 'Wi-Fi 6 (802.11ax', 'Bluetooth 5.0', 'macOS Monterey', '1 a?o', 2, '3 puertos USB-C Thunderbolt 4, 1 puerto MagSafe 3,'),
(3, 'intel core i7 1270P hasta 4.8GHz', '16GB LPDD4X', '512GB NVMe SSD', '14\" 4k Ultra HD (3840 x 2400) de 60Hz', 'Intel Iris Xe Graphics', '57Wh', 1.13, 'si', 'no', 'Wi-Fi 6 (802.11ax', 'Bluetooth 5.2', 'Windows 11 Pro', '1 a?o', 3, '2 puertos USB-C Thunderbolt 4, 2 puertos USB-A 3.2'),
(4, 'AMD Ryzen 7 7840HS base 3.8GHz hasta 5.1 GHz', '16GB DDR5 a 4800MHz', '512GB NVMe PCle 4.0 SSD', '14\" QHD (2560 x 1600) de 165Hz', 'NVIDIA Geforce RTX 4060 8GB VRam', '76Wh', 1.65, 'si', 'si', 'Wi-Fi 6 (802.11ax', 'Bluetooth 5.2', 'Windows 11 Pro', '1 a?o', 4, '2 puertos USB-C, 2 puertos USB-A 3.2 Gen 2, puerto'),
(5, 'Intel Core i7 1365U hasta 5.0 GHz', '16GB LPDDR4X a 4266M', '512GB NVMe PCle SSD', '13.5\" Oled UHD 4K (3840 x 2160) de 60Hz', 'Intel Iris Xe Graphics', '66Wh', 1.35, 'si', 'no', 'Wi-Fi 6E (802.11ax)', 'Bluetooth 5.3', 'Windows 11 Pro', '1 a?o', 5, '2 puertos USB-C thunderbolt 4, 1 puerto USB-A 3.2 '),
(6, 'Intel Core i7-11800H', '32GB DDR4', '1TB NVMe SSD', '15.6\" Full HD (1920x1080), 165Hz', 'NVIDIA GeForce RTX 3080', '86Wh', 2.37, 'HDMI 2.1', 'SD Card Reader', 'Wi-Fi 6 (802.11ax)', 'Bluetooth 5.2', 'Windows 11', '1 a?o', 6, '2 puertos USB-A 3.2, 1 puerto USB-C 3.2, 1 puerto ');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marca`
--

CREATE TABLE `marca` (
  `id_marca` int(11) NOT NULL,
  `nombre_marca` varchar(50) DEFAULT NULL,
  `descripcion_marca` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `marca`
--

INSERT INTO `marca` (`id_marca`, `nombre_marca`, `descripcion_marca`) VALUES
(1, 'Dell', 'Marca de computadoras Dell'),
(2, 'Apple', 'Marca de computadoras Apple'),
(3, 'Lenovo', 'Marca de computadoras Lenovo'),
(4, 'Hp', 'Marca de computadoras Hp'),
(5, 'Asus', 'Marca de computadoras Asus'),
(6, 'Alienware', 'Marca de computadoras Alienware');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `membresia`
--

CREATE TABLE `membresia` (
  `id_membresia` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `color` varchar(20) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_expiracion` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `membresia`
--

INSERT INTO `membresia` (`id_membresia`, `id_usuario`, `nombre`, `color`, `fecha_inicio`, `fecha_expiracion`) VALUES
(2, 2, 'Membresia Platino', 'Azul', '2024-01-02', '2024-02-01'),
(3, 3, 'Diamante', 'bg-blue-300', '2024-11-05', '2024-12-05');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `imagen` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `descripcion` text NOT NULL,
  `stock` int(10) NOT NULL,
  `id_categoria` int(11) NOT NULL,
  `id_marca` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `nombre`, `precio`, `imagen`, `created_at`, `descripcion`, `stock`, `id_categoria`, `id_marca`) VALUES
(1, 'Dell XPS 15', 1700.00, 'product1.jpg', '2024-10-19 20:49:00', 'High-performance laptop with a stunning 4K display and powerful processing capabilities.', 20, 1, 1),
(2, 'MacBook Pro 16\"', 2499.00, 'product2.jpg', '2024-10-19 20:49:00', 'Professional-grade laptop with M1 Pro chip and exceptional battery life.', 35, 3, 2),
(3, 'Lenovo ThinkPad X1', 1500.00, 'product3.jpg', '2024-10-19 20:49:00', '', 33, 1, 3),
(4, 'Asus ROG Zephyrus G14', 1399.00, 'product4.jpg', '2024-10-19 20:49:00', '', 13, 2, 5),
(5, 'HP Spectre x360', 1200.00, 'product5.jpg', '2024-10-19 20:49:00', '', 45, 5, 4),
(6, 'Alienware m15 R7', 1799.99, 'product6.jpg', '2024-11-06 00:49:22', 'La Alienware m15 R7 es una laptop gaming con un potente procesador AMD Ryzen 9, gr?fica NVIDIA GeForce RTX 3080, y pantalla Full HD de 15.6\" a 165Hz. Dise?ada para gamers que buscan un alto rendimiento y calidad gr?fica.', 15, 2, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `resena`
--

CREATE TABLE `resena` (
  `id_resena` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `resena` varchar(255) DEFAULT NULL,
  `calificacion` int(11) DEFAULT NULL CHECK (`calificacion` between 1 and 5),
  `date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `resena`
--

INSERT INTO `resena` (`id_resena`, `id_usuario`, `id_producto`, `resena`, `calificacion`, `date`) VALUES
(1, 1, 1, 'Excelente servicio, el equipo me llego en prefectas condiciones', 5, '2024-10-26 00:14:40'),
(2, 2, 1, 'no me parece pagar ese precio por el producto', 2, '2024-10-30 07:02:41'),
(3, 3, 1, 'Muy buen equipo, me ha rendido bien', 4, '2024-10-30 07:45:12'),
(4, 3, 4, 'Que gran equipo, lo vale por ese precio', 5, '2024-11-04 23:44:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `usuario` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `accountType` enum('user','company') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `usuario`, `email`, `password`, `accountType`, `created_at`) VALUES
(1, 'Franco', 'jose@gmail.com', '$2b$10$G0mPYZ.xWrV3VDUyDTZDmuACqpzqtUQEMGbanh6DB4We2EdaXB7Tu', 'user', '2024-10-19 18:13:30'),
(2, 'Jonathan', 'jonathan@gmail.com', '$2b$10$ReVFDklF6zVNJHXGBmJsVOos7KAEbphjzSwUdKfuE8w9czC7ZSz.y', 'user', '2024-10-29 03:59:14'),
(3, 'Ernesto', 'ernesto@gmail.com', '$2b$10$hIP4Ce0RmKDaG1iySVNkaupQX3zlb44/rdTg24yb8GnpHo5zgPlmK', 'user', '2024-10-30 07:16:12'),
(4, 'Cesar', 'cesar@gmail.com', '$2b$10$AH7eiasnlM9t94N59PnwWusF97qqYLqZx4qwSwrgeC/CuFGfdK87i', 'user', '2024-11-03 01:48:25'),
(5, 'Arturo', 'arturo@gmail.com', '$2b$10$4ju6MT5sEH7XOP8tZ4jJnelkseurLXWkgCor/pmE3PiNMfIlGhgcm', 'user', '2024-11-04 01:21:47');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_carrito`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_carrito` (
`id_usuario` int(11)
,`id_carrito` int(11)
,`nombre` varchar(255)
,`imagen` varchar(255)
,`precio` decimal(10,2)
,`cantidad` int(11)
,`tipo_pago` enum('contado','credito')
,`meses` int(11)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_productos`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_productos` (
`id_producto` int(11)
,`nombre` varchar(255)
,`descripcion` text
,`precio` decimal(10,2)
,`stock` int(10)
,`imagen` varchar(255)
,`nombre_categoria` varchar(50)
,`nombre_marca` varchar(50)
);

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_resenas`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_resenas` (
`id_resena` int(11)
,`resena` varchar(255)
,`calificacion` int(11)
,`date` timestamp
,`usuario` varchar(255)
,`id_producto` int(11)
,`nombre` varchar(255)
);

-- --------------------------------------------------------

--
-- Estructura para la vista `data_usuario`
--
DROP TABLE IF EXISTS `data_usuario`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `data_usuario`  AS SELECT `u`.`id_usuario` AS `id_usuario`, `u`.`usuario` AS `usuario`, `u`.`email` AS `email`, `d`.`Telefono` AS `telefono`, `d`.`direccion` AS `direccion`, `d`.`codigo_postal` AS `codigo_postal` FROM (`usuarios` `u` join `datos_usuario` `d` on(`u`.`id_usuario` = `d`.`id_usuario`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `detalle_producto`
--
DROP TABLE IF EXISTS `detalle_producto`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `detalle_producto`  AS SELECT `p`.`id_producto` AS `id_producto`, `p`.`nombre` AS `nombre`, `p`.`descripcion` AS `descripcion`, `p`.`precio` AS `precio`, `p`.`imagen` AS `imagen`, `p`.`stock` AS `stock`, `m`.`nombre_marca` AS `nombre_marca`, `c`.`nombre_categoria` AS `nombre_categoria`, `e`.`procesador` AS `procesador`, `e`.`ram_gb` AS `ram_gb`, `e`.`almacenamiento` AS `almacenamiento`, `e`.`pantalla` AS `pantalla`, `e`.`grafica` AS `grafica`, `e`.`bateria` AS `bateria`, `e`.`peso` AS `peso`, `e`.`hdmi` AS `hdmi`, `e`.`lectorSD` AS `lectorSD`, `e`.`wifi` AS `wifi`, `e`.`bluetooth` AS `bluetooth`, `e`.`sistema_operativo` AS `sistema_operativo`, `e`.`Puertos` AS `puertos`, `e`.`garantia` AS `garantia` FROM (((`productos` `p` join `marca` `m` on(`p`.`id_marca` = `m`.`id_marca`)) join `categoria` `c` on(`p`.`id_categoria` = `c`.`id_categoria`)) join `especificaciones` `e` on(`p`.`id_producto` = `e`.`id_producto`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_carrito`
--
DROP TABLE IF EXISTS `vista_carrito`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_carrito`  AS SELECT `c`.`id_usuario` AS `id_usuario`, `c`.`id_carrito` AS `id_carrito`, `p`.`nombre` AS `nombre`, `p`.`imagen` AS `imagen`, `p`.`precio` AS `precio`, `c`.`Cantidad` AS `cantidad`, `c`.`tipo_pago` AS `tipo_pago`, `c`.`meses` AS `meses` FROM (`carrito` `c` join `productos` `p` on(`c`.`id_producto` = `p`.`id_producto`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_productos`
--
DROP TABLE IF EXISTS `vista_productos`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_productos`  AS SELECT `p`.`id_producto` AS `id_producto`, `p`.`nombre` AS `nombre`, `p`.`descripcion` AS `descripcion`, `p`.`precio` AS `precio`, `p`.`stock` AS `stock`, `p`.`imagen` AS `imagen`, `c`.`nombre_categoria` AS `nombre_categoria`, `m`.`nombre_marca` AS `nombre_marca` FROM ((`productos` `p` join `categoria` `c` on(`p`.`id_categoria` = `c`.`id_categoria`)) join `marca` `m` on(`p`.`id_marca` = `m`.`id_marca`)) ;

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_resenas`
--
DROP TABLE IF EXISTS `vista_resenas`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_resenas`  AS SELECT `r`.`id_resena` AS `id_resena`, `r`.`resena` AS `resena`, `r`.`calificacion` AS `calificacion`, `r`.`date` AS `date`, `u`.`usuario` AS `usuario`, `p`.`id_producto` AS `id_producto`, `p`.`nombre` AS `nombre` FROM ((`resena` `r` join `usuarios` `u` on(`r`.`id_usuario` = `u`.`id_usuario`)) join `productos` `p` on(`r`.`id_producto` = `p`.`id_producto`)) ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`id_carrito`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `datos_usuario`
--
ALTER TABLE `datos_usuario`
  ADD PRIMARY KEY (`id_datos`),
  ADD KEY `fk_usuario` (`id_usuario`);

--
-- Indices de la tabla `empresas`
--
ALTER TABLE `empresas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `especificaciones`
--
ALTER TABLE `especificaciones`
  ADD PRIMARY KEY (`id_espec`),
  ADD KEY `fk_id_producto` (`id_producto`);

--
-- Indices de la tabla `marca`
--
ALTER TABLE `marca`
  ADD PRIMARY KEY (`id_marca`);

--
-- Indices de la tabla `membresia`
--
ALTER TABLE `membresia`
  ADD PRIMARY KEY (`id_membresia`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `fk_id_catgoria` (`id_categoria`),
  ADD KEY `fk_id_marca` (`id_marca`);

--
-- Indices de la tabla `resena`
--
ALTER TABLE `resena`
  ADD PRIMARY KEY (`id_resena`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `id_carrito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `datos_usuario`
--
ALTER TABLE `datos_usuario`
  MODIFY `id_datos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `empresas`
--
ALTER TABLE `empresas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `especificaciones`
--
ALTER TABLE `especificaciones`
  MODIFY `id_espec` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `marca`
--
ALTER TABLE `marca`
  MODIFY `id_marca` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `membresia`
--
ALTER TABLE `membresia`
  MODIFY `id_membresia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `resena`
--
ALTER TABLE `resena`
  MODIFY `id_resena` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `carrito_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `datos_usuario`
--
ALTER TABLE `datos_usuario`
  ADD CONSTRAINT `fk_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `especificaciones`
--
ALTER TABLE `especificaciones`
  ADD CONSTRAINT `fk_id_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `membresia`
--
ALTER TABLE `membresia`
  ADD CONSTRAINT `membresia_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `fk_id_catgoria` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`),
  ADD CONSTRAINT `fk_id_marca` FOREIGN KEY (`id_marca`) REFERENCES `marca` (`id_marca`);

--
-- Filtros para la tabla `resena`
--
ALTER TABLE `resena`
  ADD CONSTRAINT `resena_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `resena_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
