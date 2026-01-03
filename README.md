# Sistema de Gestión de Inventario ( ACTIVIDAD #8 DSI) UTM

Este es un sistema Full Stack para administrar activos, bodegas, categorías y movimientos, con generación de reportes PDF.

## 🚀 Tecnologías Utilizadas

- **Backend:** Node.js, Express, Prisma ORM(V6), PostgreSQL.
- **Frontend:** React, Vite, Axios, SweetAlert2.
- **Seguridad:** JWT (JSON Web Tokens), Bcryptjs.
- **Reportes:** PDFKit.

---

## 📋 Pre-requisitos

Para ejecutar este proyecto necesitas tener instalado:
1. **Node.js** (Versión 20 o superior recomendada, idealmente v24 LTS).
2. **PostgreSQL** (Servidor de base de datos corriendo).
3. **Git** (Opcional).

---

## ⚙️ Instalación y Configuración

### 1. Base de Datos (PostgreSQL)

1. Crea una base de datos vacía en PostgreSQL llamada `inventario_db`.
2. Restaura el archivo `database_backup.sql` que se incluye en la carpeta `backend` (si se provee).
   - **Opción Alternativa:** Si no hay backup, configura Prisma para crear las tablas:
     ```bash
     cd inventario-backend
     npx prisma db push
     ```
3. **IMPORTANTE:** Debes tener al menos un usuario administrador. Si la base está vacía, inserta este SQL en tu gestor de base de datos:
   ```sql
   INSERT INTO roles (id, nombre) VALUES (1, 'Administrador');
   INSERT INTO usuarios (nombre_completo, email, password, rol_id) 
   VALUES ('Admin', 'admin@empresa.com', '$2a$10$X...', 1);
   -- Nota: La contraseña del usuario admin debe crearse vía API o usar un hash válido.


### 2. Configuración del Backend
Abre una terminal y entra a la carpeta del backend:

cd inventario-backend

Instala las dependencias:

npm install

Crea un archivo .env en la raíz de inventario-backend con el siguiente contenido (ajusta tu usuario y contraseña de postgres):

 Reemplaza 'usuario' y 'password' con tus credenciales de Postgres
DATABASE_URL="postgresql://usuario:password@localhost:5432/inventario_db?schema=public"
JWT_SECRET="mi_secreto_super_seguro"
PORT=3000

Inicia el servidor:

npm run dev

Debería indicar: "Servidor corriendo en puerto 3000".

### 3. Configuración del Frontend
Abre otra terminal y entra a la carpeta del frontend:

cd inventario-frontend

Instala las dependencias:

npm install

Inicia la aplicación React:

npm run dev

Abre el navegador en la URL que te indique (generalmente http://localhost:5173).

### Si has restaurado la base de datos incluida, puedes ingresar con:

Usuario: duval.yepez@empresa.com 

Contraseña: 12345678
