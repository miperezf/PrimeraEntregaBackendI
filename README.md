
# Project Title

A brief description of what this project does and who it's for

# Carrito de Compras API

Este proyecto implementa una API RESTful utilizando Express.js para gestionar productos y carritos de compra.

## Instalación

1. Clona este repositorio.
2. Instala las dependencias con `npm install`.
3. Ejecuta el servidor local con `npm start`.

## Uso de la API en Postman

### Configuración Inicial

1. **Descargar e Instalar Postman**: Si aún no tienes Postman instalado, descárgalo [aquí](https://www.postman.com/downloads/).

2. **Importar Colección de Postman**: Importa la colección de Postman proporcionada (`CarritoDeCompras.postman_collection.json`) en tu cliente de Postman. Para importarla, sigue estos pasos:

   - Abre Postman.
   - Haz clic en `Import` en la esquina superior izquierda.
   - Selecciona el archivo `CarritoDeCompras.postman_collection.json` y haz clic en `Open`.

### Ejemplos de Solicitudes

#### Productos

##### Obtener todos los productos

- **Método:** GET
- **URL:** `http://localhost:8080/products`
- **Descripción:** Retorna todos los productos disponibles.

   ![Ejemplo Obtener Productos](/path/to/obtener_productos.png)

##### Obtener un producto por ID

- **Método:** GET
- **URL:** `http://localhost:8080/products/:id`
- **Descripción:** Retorna un producto específico según su ID.

   ![Ejemplo Obtener Producto por ID](/path/to/obtener_producto_id.png)

##### Agregar un nuevo producto

- **Método:** POST
- **URL:** `http://localhost:8080/products`
- **Descripción:** Añade un nuevo producto al sistema.
- **Body (JSON):**
  ```json
  {
    "title": "Nuevo Producto",
    "description": "Descripción del nuevo producto",
    "price": 29.99,
    "status": "disponible",
    "stock": 100,
    "category": "Electrónica",
    "thumbails": ["url1", "url2"]
  }

## Ejemplos de Solicitudes

### Productos

#### Actualizar un producto existente

- **Método:** PUT
- **URL:** `http://localhost:8080/products/:id`
- **Descripción:** Actualiza la información de un producto existente según su ID.
- **Body (JSON):**
  ```json
  {
    "title": "Nuevo Nombre del Producto",
    "description": "Nueva Descripción del Producto",
    "price": 39.99,
    "status": "agotado",
    "stock": 50,
    "category": "Electrónica",
    "thumbails": ["url1", "url2"]
  }

## Ejemplos de Solicitudes

### Productos

#### Eliminar un producto

- **Método:** DELETE
- **URL:** `http://localhost:8080/products/:id`
- **Descripción:** Elimina un producto según su ID.

### Carritos

#### Crear un nuevo carrito

- **Método:** POST
- **URL:** `http://localhost:8080/carts`
- **Descripción:** Crea un nuevo carrito vacío.

   ![Ejemplo Crear Carrito](/path/to/crear_carrito.png)

#### Obtener productos de un carrito

- **Método:** GET
- **URL:** `http://localhost:8080/carts/:cid`
- **Descripción:** Retorna los productos en un carrito específico según su ID.

   ![Ejemplo Obtener Productos del Carrito](/path/to/obtener_productos_carrito.png)

#### Agregar un producto a un carrito

- **Método:** POST
- **URL:** `http://localhost:8080/carts/:cid/product/:pid`
- **Descripción:** Agrega un producto a un carrito existente.
- **Nota:** `:cid` es el ID del carrito y `:pid` es el ID del producto.

   ![Ejemplo Agregar Producto al Carrito](/path/to/agregar_producto_carrito.png)




