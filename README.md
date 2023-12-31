# API Backend de E-commerce

Esta es la API de backend para una aplicación de comercio electrónico construida con Node.js, Express y MongoDB. La API proporciona funcionalidades para la gestión de productos, categorías y carritos de compra.

## Empezando

Para comenzar con este proyecto, sigue estos pasos:

1. Clona el repositorio en tu máquina local:
https://github.com/pademarcos/Akademi

2. Instala las dependencias necesarias:
npm install

3. Crea un archivo `.env` y configura la URI de MongoDB y el puerto según tus preferencias:
MONGODB_URI = mongodb://127.0.0.1:27017/ecommerce
PORT=3000


4. Inicia el servidor:
npm run dev


El servidor debería estar funcionando en el puerto 3000.

## Puntos de Acceso (Endpoints) de la API

La API proporciona los siguientes puntos de acceso:

- `/api/products`: Gestión de productos.
- `/api/categories`: Gestión de categorías de productos.
- `/api/carts`: Gestión de carritos de compra.

Para obtener más detalles sobre cómo utilizar estos puntos de acceso, consulta la documentación de código en los archivos de rutas correspondientes: `products.js`, `categories.js` y `carts.js`.

## Esquema de la Base de Datos

La aplicación utiliza una base de datos MongoDB con el siguiente esquema:

- `Product`: Representa un producto con name, price, brand, description y category_id.
- `Category`: Representa una categoría de productos con name.
- `Cart`: Representa un carrito de compra con productos y un precio total.

Para obtener más detalles, consulta el código en el directorio `models`.

## Manejo de Errores

La aplicación maneja errores utilizando una clase personalizada llamada `HttpError` y devuelve respuestas de error significativas para facilitar la depuración.

## Casos de uso:

- `Productos`:

Crear Producto:
Endpoint: POST /api/products/
Crea un nuevo producto en la base de datos con información como nombre, precio, marca, descripción y una categoría.

Listar todos los Productos:
Endpoint: GET /api/products/
Devuelve una lista de todos los productos disponibles.

Listar Productos por Categoría:
Endpoint: GET /api/products/category/:c_id
Lista productos filtrados por una categoría específica.

Listar Producto por ID:
Endpoint: GET /api/products/:p_id
Muestra información detallada de un producto específico identificado por su ID.

Actualizar Producto:
Endpoint: PUT /api/products/:p_id
Permite actualizar los detalles de un producto existente.

Borrar Producto:
Endpoint: DELETE /api/products/:p_id
Elimina un producto específico de la base de datos.

- `Categorias`:

Crear Categoría:
Endpoint: POST /api/categories/
Crea una nueva categoría en la base de datos con un nombre descriptivo.

Listar todas las Categorías:
Endpoint: GET /api/categories/
Devuelve una lista de todas las categorías disponibles.

Listar Categoría por ID:
Endpoint: GET /api/categories/:c_id
Muestra información detallada de una categoría específica identificada por su ID.

Actualizar Categoría:
Endpoint: PUT /api/categories/:c_id
Permite actualizar el nombre de una categoría existente.

Borrar Categoría:
Endpoint: DELETE /api/categories/:c_id
Elimina una categoría específica de la base de datos. Si alguna categoría sufre modificaciones, estos cambios deben reflejarse en los productos relacionados.

- `Carrito de Compra`:

Listar Carritos:
Endpoint: GET /api/carts/
Obtiene una lista de todos los carritos en la base de datos.

Listar Carrito por ID:
Endpoint: GET /api/carts/:cartId
Obtiene un carrito específico según su ID.

Crear Carrito:
Endpoint: POST /api/carts/
Crea un nuevo carrito vacío en la base de datos.

Agregar Producto al Carrito:
Endpoint: POST /api/carts/:cartId
Agrega un producto al carrito especificado. El producto debe especificarse junto con la cantidad.

Actualizar Producto en el Carrito:
Endpoint: PUT /api/carts/:cartId
Permite actualizar la cantidad de un producto en el carrito.

Borrar Producto del Carrito:
Endpoint: DELETE /api/carts/:cartId/delete/:productId
Elimina un producto específico del carrito.

Borrar Carrito:
Endpoint: DELETE /api/carts/:cartId
Elimina un carrito. Si el carrito está vacío, se puede eliminar; de lo contrario, no se permite su eliminación.
