# Gestor de Tareas - Aplicación React Native - IDL2 Desarrollo Movil

Esta aplicación móvil permite a los usuarios gestionar sus tareas diarias, ofreciendo funcionalidades para crear, editar, eliminar y visualizar tareas. Cada tarea cuenta con título, descripción, fecha de vencimiento y nivel de prioridad.

## 📱 Características

- **Gestión completa de tareas:** Crear, editar y eliminar tareas
- **Información de cada tarea:**
  - Título
  - Descripción
  - Fecha de vencimiento
  - Prioridad (Alta, Media, Baja) con indicadores visuales
- **Almacenamiento local:** Persistencia de datos en el dispositivo
- **Interfaz intuitiva:** Diseño simple y fácil de usar

## 🛠️ Requisitos previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Android Studio](https://developer.android.com/studio) (para el emulador)
- [Expo Go](https://expo.dev/client) (para pruebas en dispositivo físico)

## ⚙️ Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/gestor-tareas.git
cd GestorTareas
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Iniciar la aplicación

```bash
npm start
```

## 📲 Opciones para ejecutar la aplicación

### Opción 1: Dispositivo físico (recomendado)

1. Instala la aplicación **Expo Go** en tu dispositivo Android o iOS
2. Escanea el código QR que aparece en la terminal o en la página web de Expo
3. La aplicación se cargará automáticamente en tu dispositivo

### Opción 2: Emulador de Android

1. Inicia el emulador de Android Studio
2. Con el proyecto Expo en ejecución, presiona la tecla `a` en la terminal
3. La aplicación se instalará y abrirá en el emulador

### Opción 3: Emulador de iOS (solo macOS)

1. Inicia el simulador de iOS desde Xcode
2. Con el proyecto Expo en ejecución, presiona la tecla `i` en la terminal
3. La aplicación se instalará y abrirá en el simulador

## 📂 Estructura del proyecto

```
gestor-tareas/
├── App.js            # Componente principal de la aplicación
├── app.json          # Configuración de la aplicación Expo
├── assets/           # Imágenes y recursos estáticos
├── package.json      # Dependencias del proyecto
└── node_modules/     # Paquetes instalados (generado automáticamente)
```

## 🧩 Dependencias principales

- **react-native**: Framework para desarrollo de aplicaciones móviles
- **expo**: Plataforma para desarrollo y despliegue simplificado
- **@react-native-community/datetimepicker**: Selector de fecha y hora
- **@react-native-async-storage/async-storage**: Almacenamiento local persistente

## 🤝 Contribuciones

Para contribuir al proyecto:

1. Haz un fork del repositorio
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza tus cambios
4. Commit tus cambios (`git commit -m 'Añadir nueva funcionalidad'`)
5. Push a la rama (`git push origin feature/nueva-funcionalidad`)
6. Abre un Pull Request

## 📝 Posibles mejoras

- Implementación de categorías para las tareas
- Filtros y búsqueda avanzada
- Notificaciones para tareas próximas a vencer
- Sincronización con servicios en la nube
- Temas oscuro/claro
- Estadísticas de productividad

Jhair Lescano
