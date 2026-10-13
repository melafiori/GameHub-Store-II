/* ----------------------------------------------------- PRODUCTOS SIMULADOS -----------------------------------------------------*/
window.productos = [

    /*---------------- NOTEBOOKS ----------------*/
    {
        id: 1,
        nombre: "ASUS TUF Gaming A15",
        categoria: "Notebooks",
        marca: "ASUS",
        precio: 899990,
        stock: 10,
        estado: "En stock",
        imagen: "https://cl-dam-resizer.ecomm.cencosud.com/unsafe/adaptive-fit-in/1920x0/cl/paris/406334999/variant/698c823ac83fe99183122a88/images/d638ffa3-d3c8-4705-81a3-043f4cc66f47/406334999-0000-001.jpg",
        descripcion: "Notebook gamer ASUS TUF Gaming A15 diseñada para ofrecer un buen rendimiento en videojuegos y tareas exigentes, con un diseño resistente y sistema de refrigeración optimizado.", 
        especificaciones: { "Procesador": "AMD Ryzen 7", "Memoria RAM": "16 GB", "Almacenamiento": "512 GB SSD", "Tarjeta gráfica": "NVIDIA GeForce RTX 3050", "Pantalla": "15.6 pulgadas Full HD", "Sistema operativo": "Windows 11", "Conectividad": "Wi-Fi 6, Bluetooth" }
    },

    {
        id: 2,
        nombre: "ROG Strix SCAR 18 (2026)G835LXG-TQ464W",
        categoria: "Notebooks",
        marca: "ASUS",
        precio: 999990,
        stock: 5,
        estado: "En stock",
        imagen:"https://dlcdnwebimgs.asus.com/gain/6B2FAE90-9A5A-4758-91EE-073829291922/w717/h525/fwebp",
        descripcion: "Notebook gamer de alto rendimiento ASUS ROG Strix SCAR 18, orientado a videojuegos exigentes y tareas de alto consumo de recursos.", 
        especificaciones: { "Procesador": "Intel Core i9", "Memoria RAM": "32 GB", "Almacenamiento": "1 TB SSD", "Tarjeta gráfica": "NVIDIA GeForce RTX 4080", "Pantalla": "18 pulgadas", "Sistema operativo": "Windows 11", "Conectividad": "Wi-Fi 6E, Bluetooth" }
    },

    {
        id: 3,
        nombre: "ASUS ROG Strix G16",
        categoria: "Notebooks",
        marca: "ASUS",
        precio: 1299990,
        stock: 3,
        estado: "Últimas unidades",
        imagen:"https://dlcdnwebimgs.asus.com/gain/1F39694F-8FC1-4B6E-97E4-13FF63D92FE5/w717/h525/fwebp",
        descripcion: "Notebook gamer ASUS ROG Strix G16 que combina alto rendimiento, pantalla de alta frecuencia y componentes orientados al gaming.", 
        especificaciones: { "Procesador": "Intel Core i7", "Memoria RAM": "16 GB", "Almacenamiento": "1 TB SSD", "Tarjeta gráfica": "NVIDIA GeForce RTX 4060", "Pantalla": "16 pulgadas Full HD+", "Sistema operativo": "Windows 11", "Conectividad": "Wi-Fi 6E, Bluetooth" }
    },

    /*---------------- TARJETAS GRÁFICAS ----------------*/
    {
        id: 4,
        nombre: "ASUS Dual GeForce RTX 4070 Super",
        categoria: "Tarjetas Gráficas",
        marca: "ASUS",
        precio: 449990,
        stock: 10,
        estado: "En stock",
        imagen:"https://dlcdnwebimgs.asus.com/gain/09ef6317-9cba-4d16-a4e6-77e21dc8c0af/w692",
        descripcion: "Tarjeta gráfica ASUS Dual GeForce RTX 4070 Super con diseño de doble ventilador Axial-tech, disipador de gran superficie y backplate reforzado. Ideal para gaming en 1440p y 4K con tecnologías DLSS 3 y Ray Tracing de última generación.",
        especificaciones: {
            "Chipset": "NVIDIA GeForce RTX 4070 Super",
            "Memoria": "12 GB GDDR6X",
            "Interfaz de memoria": "192-bit",
            "Frecuencia Boost": "2505 MHz (modo OC)",
            "Conectores de salida": "2x HDMI 2.1, 2x DisplayPort 1.4a",
            "Alimentación requerida": "1x 8 pines, fuente mínima recomendada 650W",
            "Dimensiones": "267.6 x 129.9 x 50.4 mm",
            "Interfaz": "PCI Express 4.0"
    }
    },

    {
        id: 5,
        nombre: "MSI Gaming X RTX 4060 Ti",
        categoria: "Tarjetas Gráficas",
        marca: "MSI",
        precio: 549990,
        stock: 10,
        estado: "En stock",
        imagen:"https://storage-asset.msi.com/global/picture/image/feature/vga/NVIDIA/RTX-4060-Ti-GAMING-X-8G/graphics-card.png",
        descripcion: "Tarjeta gráfica MSI Gaming X RTX 4060 Ti diseñada para ofrecer un excelente rendimiento en juegos con resolución 1080p y 1440p.",
        especificaciones: {
            "Chipset": "NVIDIA GeForce RTX 4060 Ti",
            "Memoria": "8 GB GDDR6",
            "Interfaz de memoria": "128-bit",
            "Frecuencia Boost": "2535 MHz",
            "Conectores de salida": "3x DisplayPort, 1x HDMI",
            "Alimentación requerida": "1x 8 pines",
            "Interfaz": "PCI Express 4.0"
    }
    },

    {
        id: 6,
        nombre: "Gigabyte Gaming OC RX 7800 XT",
        categoria: "Tarjetas Gráficas",
        marca: "Gigabyte",
        precio: 649990,
        stock: 0,
        estado: "Sin stock",
        imagen:"https://media.spdigital.cl/thumbnails/products/6s93b4nm_48ae52d8_thumbnail_512.png",
        descripcion: "Tarjeta gráfica Gigabyte Gaming OC RX 7800 XT diseñada para ofrecer un alto rendimiento en videojuegos, especialmente en resoluciones 1440p y 4K.", 
        especificaciones: { "Chipset": "AMD Radeon RX 7800 XT", "Memoria": "16 GB GDDR6", "Interfaz de memoria": "256-bit", "Frecuencia Boost": "Hasta 2520 MHz", "Conectores de salida": "2x DisplayPort, 2x HDMI", "Alimentación requerida": "2x 8 pines", "Interfaz": "PCI Express 4.0" }
    },

    {
        id: 7,
        nombre: "Zotac Gaming Trinity RTX 4090",
        categoria: "Tarjetas Gráficas",
        marca: "Zotac",
        precio: 2199990,
        stock: 10,
        estado: "En stock",
        imagen:"https://media.spdigital.cl/thumbnails/products/zrybrwu0_31108081_thumbnail_512.jpg",
        descripcion: "Tarjeta gráfica Zotac Gaming Trinity RTX 4090 orientada a gaming de alto rendimiento y aplicaciones que requieren gran capacidad de procesamiento gráfico.", 
        especificaciones: { "Chipset": "NVIDIA GeForce RTX 4090", "Memoria": "24 GB GDDR6X", "Interfaz de memoria": "384-bit", "Frecuencia Boost": "2520 MHz", "Conectores de salida": "3x DisplayPort, 1x HDMI", "Alimentación requerida": "1x 16 pines", "Interfaz": "PCI Express 4.0" }
    },

    {
        id: 8,
        nombre: "ASUS TUF Gaming RTX 4060",
        categoria: "Tarjetas Gráficas",
        marca: "ASUS",
        precio: 399990,
        stock: 3,
        estado: "Últimas unidades",
        imagen:"https://dlcdnwebimgs.asus.com/gain/d1a63293-deab-4c00-a406-6dc372ab3c00/w692",
        descripcion: "Tarjeta gráfica ASUS TUF Gaming RTX 4060 diseñada para ofrecer un rendimiento equilibrado en videojuegos en resolución Full HD y 1440p.", 
        especificaciones: { "Chipset": "NVIDIA GeForce RTX 4060", "Memoria": "8 GB GDDR6", "Interfaz de memoria": "128-bit", "Frecuencia Boost": "2535 MHz", "Conectores de salida": "3x DisplayPort, 1x HDMI", "Alimentación requerida": "1x 8 pines", "Interfaz": "PCI Express 4.0" }
    },

    {
        id: 9,
        nombre: "MSI Gaming Trio RX 7900 XTX",
        categoria: "Tarjetas Gráficas",
        marca: "MSI",
        precio: 1099990,
        stock: 10,
        estado: "En stock",
        imagen:"https://storage-asset.msi.com/global/picture/product/product_167098328944b7e22b5ac4a520efdf017074166476.webp",
        descripcion: "Tarjeta gráfica MSI Gaming Trio RX 7900 XTX orientada a gaming de alto rendimiento, especialmente para resoluciones 4K.", 
        especificaciones: { "Chipset": "AMD Radeon RX 7900 XTX", "Memoria": "24 GB GDDR6", "Interfaz de memoria": "384-bit", "Frecuencia Boost": "Hasta 2615 MHz", "Conectores de salida": "3x DisplayPort, 1x HDMI", "Alimentación requerida": "3x 8 pines", "Interfaz": "PCI Express 4.0" }
    },

    {
        id: 10,
        nombre: "Gigabyte Aorus Master RTX 4080 Super",
        categoria: "Tarjetas Gráficas",
        marca: "Gigabyte",
        precio: 1549990,
        stock: 10,
        estado: "En stock",
        imagen:"https://www.gigabyte.com/FileUpload/Global/KeyFeature/3586/innergigabyteimages/kf-img.png",
        descripcion: "Tarjeta gráfica Gigabyte Aorus Master RTX 4080 Super de alto rendimiento, pensada para gaming en altas resoluciones y configuraciones gráficas exigentes.", 
        especificaciones: { "Chipset": "NVIDIA GeForce RTX 4080 Super", "Memoria": "16 GB GDDR6X", "Interfaz de memoria": "256-bit", "Frecuencia Boost": "Hasta 2595 MHz", "Conectores de salida": "3x DisplayPort, 1x HDMI", "Alimentación requerida": "1x 16 pines", "Interfaz": "PCI Express 4.0" }
    },

    {
        id: 11,
        nombre: "Zotac Twin Edge RTX 4070",
        categoria: "Tarjetas Gráficas",
        marca: "Zotac",
        precio: 599990,
        stock: 0,
        estado: "Sin stock",
        imagen:"https://media.spdigital.cl/thumbnails/products/25df4qkb_d7b7546e_thumbnail_4096.jpg",
        descripcion: "Tarjeta gráfica Zotac Twin Edge RTX 4070 con diseño compacto y rendimiento orientado a gaming en resolución 1440p.", 
        especificaciones: { "Chipset": "NVIDIA GeForce RTX 4070", "Memoria": "12 GB GDDR6X", "Interfaz de memoria": "192-bit", "Frecuencia Boost": "2475 MHz", "Conectores de salida": "3x DisplayPort, 1x HDMI", "Alimentación requerida": "1x 8 pines", "Interfaz": "PCI Express 4.0" }
    },

    {
        id: 12,
        nombre: "ASUS Dual RX 7600",
        categoria: "Tarjetas Gráficas",
        marca: "ASUS",
        precio: 279990,
        stock: 10,
        estado: "En stock",
        imagen:"https://dlcdnwebimgs.asus.com/gain/b5a51e38-f9a3-41f6-817f-dfcb8495418c/w692",
        descripcion: "Tarjeta gráfica ASUS Dual RX 7600 diseñada para ofrecer un buen rendimiento en gaming en resolución 1080p.", 
        especificaciones: { "Chipset": "AMD Radeon RX 7600", "Memoria": "8 GB GDDR6", "Interfaz de memoria": "128-bit", "Frecuencia Boost": "Hasta 2695 MHz", "Conectores de salida": "3x DisplayPort, 1x HDMI", "Alimentación requerida": "1x 8 pines", "Interfaz": "PCI Express 4.0" }
    },

    {
        id: 13,
        nombre: "Gigabyte Windforce RTX 4060 Ti",
        categoria: "Tarjetas Gráficas",
        marca: "Gigabyte",
        precio: 519990,
        stock: 10,
        estado: "En stock",
        imagen:"https://www.gigabyte.com/FileUpload/Global/KeyFeature/2421/innergigabyteimages/kf-img.png",
        descripcion: "Tarjeta gráfica Gigabyte Windforce RTX 4060 Ti equipada con un sistema de refrigeración diseñado para mantener buenas temperaturas durante sesiones de juego prolongadas.", 
        especificaciones: { "Chipset": "NVIDIA GeForce RTX 4060 Ti", "Memoria": "8 GB GDDR6", "Interfaz de memoria": "128-bit", "Frecuencia Boost": "2535 MHz", "Conectores de salida": "3x DisplayPort, 1x HDMI", "Alimentación requerida": "1x 8 pines", "Interfaz": "PCI Express 4.0" }
    },

    {
        id: 14,
        nombre: "MSI Suprim X RTX 4070 Ti Super",
        categoria: "Tarjetas Gráficas",
        marca: "MSI",
        precio: 999990,
        stock: 3,
        estado: "Últimas unidades",
        imagen:"https://storage-asset.msi.com/global/picture/image/feature/vga/NVIDIA/RTX-4070-Ti-GAMING-X-SLIM/msi-4070-ti-gaming-x-slim-12g-img.png",
        descripcion: "Tarjeta gráfica MSI Suprim X RTX 4070 Ti Super de alto rendimiento, ideal para jugar en 1440p y 4K con configuraciones gráficas elevadas.", 
        especificaciones: { "Chipset": "NVIDIA GeForce RTX 4070 Ti Super", "Memoria": "16 GB GDDR6X", "Interfaz de memoria": "256-bit", "Frecuencia Boost": "Hasta 2655 MHz", "Conectores de salida": "3x DisplayPort, 1x HDMI", "Alimentación requerida": "1x 16 pines", "Interfaz": "PCI Express 4.0" }
    },

    {
        id: 15,
        nombre: "Zotac NVIDIA GEFORCE RTX 5060 8GB GAMING TWIN Edge OC",
        categoria: "Tarjetas Gráficas",
        marca: "Zotac",
        precio: 489990,
        stock: 10,
        estado: "En stock",
        imagen:"https://assets.pcfactory.cl/public/foto/55201/1_500.jpg?t=1767125436201",
        descripcion: "Tarjeta gráfica Zotac GeForce RTX 5060 de 8 GB orientada a gaming con un diseño compacto y soporte para tecnologías gráficas de nueva generación.", 
        especificaciones: { "Chipset": "NVIDIA GeForce RTX 5060", "Memoria": "8 GB GDDR7", "Interfaz de memoria": "128-bit", "Frecuencia Boost": "Hasta 2497 MHz", "Conectores de salida": "3x DisplayPort, 1x HDMI", "Alimentación requerida": "1x 8 pines", "Interfaz": "PCI Express 5.0" }
    },

    /*---------------- PROCESADORES ----------------*/
    {
        id: 16,
        nombre: "AMD Ryzen 5 7600",
        categoria: "Procesadores",
        marca: "AMD",
        precio: 189990,
        stock: 15,
        estado: "En stock",
        imagen:"https://media.solotodo.com/media/products/1696740_picture_1673410406.jpg",
        descripcion: "Procesador AMD Ryzen 5 7600 pensado para equipos gaming y de uso general, ofreciendo un buen equilibrio entre rendimiento y consumo.", 
        especificaciones: { "Núcleos": "6", "Hilos": "12", "Frecuencia base": "3.8 GHz", "Frecuencia máxima": "5.1 GHz", "Socket": "AM5", "Caché": "38 MB", "Arquitectura": "Zen 4" }
    },

    {
        id: 17,
        nombre: "AMD Ryzen 7 7800X3D",
        categoria: "Procesadores",
        marca: "AMD",
        precio: 399990,
        stock: 7,
        estado: "En stock",
        imagen:"https://http2.mlstatic.com/D_NQ_NP_780006-MLA99524053088_122025-O.webp",
        descripcion: "Procesador AMD Ryzen 7 7800X3D orientado principalmente al gaming, con tecnología 3D V-Cache para mejorar el rendimiento en videojuegos.", 
        especificaciones: { "Núcleos": "8", "Hilos": "16", "Frecuencia base": "4.2 GHz", "Frecuencia máxima": "5.0 GHz", "Socket": "AM5", "Caché": "104 MB", "Arquitectura": "Zen 4" }
    },

    {
        id: 18,
        nombre: "Intel Core i7-14700K",
        categoria: "Procesadores",
        marca: "Intel",
        precio: 449990,
        stock: 4,
        estado: "Últimas unidades",
        imagen:"https://i5.walmartimages.cl/asr/839087e5-add0-4900-abfb-34277d0b4379.054ed5af95f298e2bff3a3ebee3f1a9d.jpeg",
        descripcion: "Procesador Intel Core i7-14700K de alto rendimiento diseñado para gaming, creación de contenido y tareas exigentes.", 
        especificaciones: { "Núcleos": "20", "Hilos": "28", "Frecuencia máxima": "5.6 GHz", "Socket": "LGA1700", "Caché": "33 MB", "Arquitectura": "Raptor Lake", "Gráficos integrados": "Intel UHD Graphics 770" }
    },

    /*---------------- PERIFÉRICOS ----------------*/
    {
        id: 19,
        nombre: "Teclado Mecánico RGB",
        categoria: "Periféricos",
        marca: "ASUS",
        precio: 110990,
        stock: 20,
        estado: "En stock",
        imagen:"https://dlcdnwebimgs.asus.com/gain/AA156B88-2346-4523-9D4C-8E2B477BFE9C/w717/h525/fwebp",
        descripcion: "Teclado mecánico gamer con iluminación RGB y diseño orientado a ofrecer una respuesta rápida y cómoda durante las sesiones de juego.", 
        especificaciones: { "Tipo": "Teclado mecánico", "Iluminación": "RGB", "Conexión": "USB", "Distribución": "Español", "Compatibilidad": "Windows", "Uso": "Gaming y oficina" }
    },

    {
        id: 20,
        nombre: "Mouse TUF Gaming M4 Air",
        categoria: "Periféricos",
        marca: "ASUS",
        precio: 79990,
        stock: 12,
        estado: "En stock",
        imagen:"https://dlcdnwebimgs.asus.com/gain/4226fad1-30f1-4773-9f20-5746f139d632/w692",
        descripcion: "Mouse gamer ASUS TUF Gaming M4 Air con diseño liviano y sensor óptico de alta precisión, pensado para juegos competitivos.", 
        especificaciones: { "Sensor": "Óptico", "Resolución": "Hasta 16.000 DPI", "Conexión": "USB", "Botones": "6", "Peso": "47 g aproximadamente", "Iluminación": "RGB" }
    },

    {
        id: 21,
        nombre: "Audifonos ROG Delta S Animate",
        categoria: "Periféricos",
        marca: "ASUS",
        precio: 120000,
        stock: 0,
        estado: "Sin stock",
        imagen:"https://dlcdnwebimgs.asus.com/gain/28EFE950-BAD3-4B17-9C43-05F86CA7B6B5/w717/h525/fwebp",
        descripcion: "Audífonos gaming ASUS ROG Delta S Animate con sonido de alta resolución y diseño orientado a una experiencia inmersiva durante el juego.", 
        especificaciones: { "Tipo": "Audífonos gaming", "Conexión": "USB-C", "Audio": "Hi-Res", "Micrófono": "Integrado", "Iluminación": "RGB", "Compatibilidad": "PC, PlayStation y Nintendo Switch" }
    },

    /*---------------- CONSOLAS ----------------*/
    {
        id: 22,
        nombre: "PlayStation 5 Slim",
        categoria: "Consolas",
        marca: "Sony",
        precio: 649990,
        stock: 5,
        estado: "En stock",
        imagen:"https://gmedia.playstation.com/is/image/SIEPDC/ps5-digital-edition-box-image-block-01-en-02apr25?$1600px--t$",
        descripcion: "PlayStation 5 Slim con un diseño más compacto y rendimiento de nueva generación para disfrutar videojuegos con tiempos de carga reducidos.", 
        especificaciones: { "CPU": "AMD Zen 2 de 8 núcleos", "GPU": "AMD RDNA 2", "Almacenamiento": "SSD 1 TB", "Resolución": "Hasta 4K", "Conectividad": "Wi-Fi, Bluetooth", "Salida de video": "HDMI 2.1" }
    },

    {
        id: 23,
        nombre: "Xbox Series X",
        categoria: "Consolas",
        marca: "Microsoft",
        precio: 599990,
        stock: 3,
        estado: "Últimas unidades",
        imagen:"https://cms-assets.xboxservices.com/assets/bc/40/bc40fdf3-85a6-4c36-af92-dca2d36fc7e5.png?n=642227_Hero-Gallery-0_A1_857x676.png",
        descripcion: "Xbox Series X diseñada para ofrecer alto rendimiento, tiempos de carga rápidos y videojuegos en resoluciones de hasta 4K.", 
        especificaciones: { "CPU": "AMD Zen 2 de 8 núcleos", "GPU": "AMD RDNA 2", "Almacenamiento": "1 TB SSD", "Resolución": "Hasta 4K", "Memoria RAM": "16 GB GDDR6", "Conectividad": "Wi-Fi, Bluetooth" }
    },

    {
        id: 24,
        nombre: "Nintendo Switch OLED",
        categoria: "Consolas",
        marca: "Nintendo",
        precio: 349990,
        stock: 10,
        estado: "En stock",
        imagen:"https://assets.nintendo.com/image/upload/f_auto/q_auto/c_fill,w_800/ncom/en_US/switch/site-design-update/hardware-hero-combo",
        descripcion: "Nintendo Switch OLED con pantalla OLED de 7 pulgadas, diseñada para jugar tanto en modo portátil como conectada al televisor.", 
        especificaciones: { "Pantalla": "7 pulgadas OLED", "Resolución": "1280 x 720", "Almacenamiento": "64 GB", "Modos de juego": "TV, sobremesa y portátil", "Conectividad": "Wi-Fi, Bluetooth", "Salida de video": "Hasta 1080p mediante dock" }
    },

    /*---------------- MONITORES ----------------*/
    {
        id: 25,
        nombre: "ASUS TUF Gaming 27 pulgadas",
        categoria: "Monitores",
        marca: "ASUS",
        precio: 159990,
        stock: 8,
        estado: "En stock",
        imagen:"https://dlcdnimgs.asus.com/websites/global/products/5ston8knwsuoe50e/images/ready2.png",
        descripcion: "Monitor ASUS TUF Gaming de 27 pulgadas diseñado para gaming, con alta frecuencia de actualización y tecnologías para mejorar la fluidez de imagen.", 
        especificaciones: { "Tamaño": "27 pulgadas", "Resolución": "Full HD", "Frecuencia": "165 Hz", "Panel": "IPS", "Tiempo de respuesta": "1 ms", "Conectores": "DisplayPort, HDMI" }
    },

    {
        id: 26,
        nombre: "MSI Optix 27 pulgadas",
        categoria: "Monitores",
        marca: "MSI",
        precio: 349990,
        stock: 5,
        estado: "En stock",
        imagen:"https://storage-asset.msi.com/global/picture/product/product_16402525174e8780ce9c4e99456f1999bb4d0c3bb6.webp",
        descripcion: "Monitor MSI Optix de 27 pulgadas pensado para gaming, con una pantalla de alta frecuencia y respuesta rápida.", 
        especificaciones: { "Tamaño": "27 pulgadas", "Resolución": "Full HD", "Frecuencia": "165 Hz", "Panel": "IPS", "Tiempo de respuesta": "1 ms", "Conectores": "DisplayPort, HDMI" }
    },

    {
        id: 27,
        nombre: "Gigabyte Gaming 32 pulgadas",
        categoria: "Monitores",
        marca: "Gigabyte",
        precio: 329990,
        stock: 2,
        estado: "Últimas unidades",
        imagen:"https://media.spdigital.cl/thumbnails/products/hxulfw1__d3f9044d_thumbnail_512.png",
        descripcion: "Monitor Gigabyte Gaming de 32 pulgadas diseñado para ofrecer una experiencia de juego inmersiva gracias a su gran tamaño de pantalla.", 
        especificaciones: { "Tamaño": "32 pulgadas", "Resolución": "2560 x 1440", "Frecuencia": "165 Hz", "Panel": "VA", "Tiempo de respuesta": "1 ms", "Conectores": "DisplayPort, HDMI" }
    },

    /*---------------- ACCESORIOS ----------------*/
    {
        id: 28,
        nombre: "Micrófono ROG Carnyx",
        categoria: "Accesorios",
        marca: "ASUS",
        precio: 160990,
        stock: 15,
        estado: "En stock",
        imagen:"https://dlcdnwebimgs.asus.com/gain/792F041A-5EFB-4801-9D41-999B4481AA68/w717/h525/fwebp",
        descripcion: "Micrófono ASUS ROG Carnyx diseñado para streaming, grabación y comunicación durante videojuegos, con captación de voz de alta calidad.", 
        especificaciones: { "Tipo": "Micrófono de condensador", "Conexión": "USB-C", "Patrón polar": "Cardioide", "Frecuencia": "20 Hz - 20 kHz", "Control": "Volumen y silencio", "Uso": "Gaming, streaming y grabación" }
    },

    {
        id: 29,
        nombre: "Mouse Pad gamer",
        categoria: "Accesorios",
        marca: "ASUS",
        precio: 40990,
        stock: 20,
        estado: "En stock",
        imagen:"https://cl.store.asus.com/media/catalog/product/_/c/_cxm2mqaoob63kmcu.png",
        descripcion: "Mouse pad gamer ASUS diseñado para ofrecer una superficie amplia y uniforme para movimientos precisos del mouse.", 
        especificaciones: { "Tipo": "Mouse pad gamer", "Superficie": "Tela", "Base": "Antideslizante", "Bordes": "Costura reforzada", "Uso": "Gaming y oficina", "Compatibilidad": "Mouse óptico y láser" }
    },

    {
        id: 30,
        nombre: "Soporte para audifonos ROG Throne Qi",
        categoria: "Accesorios",
        marca: "ASUS",
        precio: 99990,
        stock: 0,
        estado: "Sin stock",
        imagen:"https://dlcdnwebimgs.asus.com/gain/9FC23A95-0011-4B09-957C-F80B1FF6527C/w717/h525/fwebp",
        descripcion: "Soporte ASUS ROG Throne Qi diseñado para mantener los audífonos organizados e incorporar funciones adicionales como iluminación RGB y carga inalámbrica.", 
        especificaciones: { "Tipo": "Soporte para audífonos", "Iluminación": "RGB", "Carga inalámbrica": "Qi", "Conexión": "USB", "Compatibilidad": "Audífonos y dispositivos compatibles con Qi", "Uso": "Gaming y escritorio" }
    }
];