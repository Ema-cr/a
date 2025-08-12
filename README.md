# 📦 Proyecto Base de Datos con Backend y Frontend

Este proyecto implementa una base de datos relacional normalizada a partir de un archivo CSV, junto con un **backend** y un **frontend** para su gestión.  
Se incluyen herramientas para poblar la base de datos, realizar consultas desde Postman y documentar todas las queries SQL utilizadas.

---

## 📋 Características principales
- **Normalización** del archivo CSV hasta la 3FN.
- **Backend** para manejar API REST y conexión a la base de datos.
- **Frontend** básico para interactuar con los datos.
- **Carga masiva de datos** .
- **Pruebas de consultas** con Postman.
- **Documentación** de todas las queries.

---

## 🗂️ Estructura del proyecto
┣ 📂 backend # Código del servidor y API
┣ 📂 frontend # Interfaz de usuario
┣ 📂 database # Scripts SQL y datos
┗ README.md

---

## 🛠️ Tecnologías utilizadas
- **Base de datos:** MySQL
- **Backend:** Node.js + Express
- **Frontend:** HTML, JavaScript
- **Herramientas:** Visual Studio Code, Postman

## 📊 Modelo entidad-relación (DER)

<img width="1186" height="853" alt="image" src="https://github.com/user-attachments/assets/2826156c-441b-4cf6-a79b-4034dc953c37" />

## 🧩 Normalización
Este proyecto parte de un archivo CSV con datos crudos, que fue **normalizado hasta la Tercera Forma Normal (3FN)** para asegurar:
1. Eliminación de redundancias.
2. Integridad de datos.
3. Relaciones claras entre tablas.

📄 **Archivo CSV original**: `/database/datos_original.csv`  
📄 **Archivo normalizado**: `/database/datos_normalizados.sql`

---
