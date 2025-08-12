require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();

// Configuración de Multer (guardar en carpeta temporal)
const upload = multer({ dest: 'uploads/' });

// Endpoint para subir CSV
app.post('/upload-patients', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se envió ningún archivo' });
  }

  const filePath = path.join(__dirname, req.file.path);

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const patients = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        if (row.patient_name && row.patient_email && row.password) {
          patients.push(row);
        } else {
          console.log('Fila inválida, se saltará:', row);
        }
      })
      .on('end', async () => {
        console.log(`CSV leído. Se procesarán ${patients.length} pacientes...`);

        for (const p of patients) {
          try {
            await connection.execute(
              'INSERT INTO Patients (patient_name, patient_email, password) VALUES (?, ?, ?)',
              [p.patient_name, p.patient_email, p.password]
            );
            console.log(`Paciente ${p.patient_name} insertado`);
          } catch (error) {
            console.error(`Error insertando paciente ${p.patient_name}:`, error.message);
          }
        }

        await connection.end();
        fs.unlinkSync(filePath); // Borrar archivo temporal
        res.json({ message: 'Carga terminada', total: patients.length });
      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error procesando el archivo' });
  }
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000');
});
