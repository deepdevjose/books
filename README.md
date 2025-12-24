# 📚 BookShelf - Tu Biblioteca Digital

Una aplicación web elegante para leer y gestionar una biblioteca personal de libros digitales.

![BookShelf Preview](src/books/iseeyoureyes/frontiseeyoureyes.png)

## ✨ Características

- **📖 Lector de PDF integrado** - Lee tus libros directamente en la app con navegación de páginas
- **💾 Guardado de progreso** - Tu progreso de lectura se guarda automáticamente en localStorage
- **📱 Diseño responsivo** - Funciona perfectamente en móviles, tablets y escritorio
- **🔌 Funciona offline (PWA)** - Instala la app y úsala sin conexión a internet
- **🎄 Tarjeta de regalo especial** - Incluye una tarjeta navideña con video personalizado
- **🔐 Sistema de login** - Acceso protegido con usuario y contraseña
- **📚 Biblioteca personal** - Organiza tus libros y marca tus favoritos

## 🚀 Tecnologías

- HTML5 / CSS3 / JavaScript (Vanilla)
- PDF.js para renderizado de PDFs
- Service Worker para funcionalidad offline
- LocalStorage para persistencia de datos

## 📁 Estructura del Proyecto

```
books/
├── index.html          # Página principal
├── manifest.json       # PWA manifest
├── service-worker.js   # Service worker para offline
├── src/
│   ├── css/
│   │   └── styles.css  # Estilos globales
│   ├── js/
│   │   ├── script.js   # Lógica principal
│   │   └── pdf-reader.js # Lector de PDF
│   ├── assets/         # Imágenes y videos
│   └── books/          # Contenido de libros (PDFs, portadas)
└── README.md
```

## 🎮 Uso

1. Abre `index.html` con Live Server o un servidor local
2. Inicia sesión con las credenciales
3. Explora la biblioteca y haz clic en un libro para ver detalles
4. Presiona "Comenzar a leer" para abrir el lector de PDF

## 📲 Instalación como PWA

1. Abre la app en Chrome o Edge
2. Haz clic en el ícono de "Instalar" en la barra de direcciones
3. ¡Listo! Ahora puedes usar BookShelf como una app nativa

## 🎁 Contenido Especial

Este proyecto incluye una tarjeta de regalo navideña personalizada con un mensaje especial y video.

## 👤 Autor

**Jose Manuel Cortes Ceron**

---

Hecho con ❤️ para alguien especial