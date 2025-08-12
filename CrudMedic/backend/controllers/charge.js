const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const db = require('../config/db'); // Asegúrate que la ruta es correcta

async function uploadCSV(req, res) {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  const filePath = path.join(process.cwd(), req.file.path);
  const rows = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => rows.push(row))
    .on('end', async () => {
      try {
        for (const r of rows) {
          // Insertar paciente si tiene datos de paciente
          if (r.patient_name && r.patient_email && r.password) {
            await db.query(
              'INSERT INTO Patients (patient_name, patient_email, password) VALUES (?, ?, ?)',
              [r.patient_name, r.patient_email, r.password]
            );
          }

          // Insertar doctor si tiene datos de doctor
          if (r.doctor_name && r.specialty && r.doctor_email && r.password) {
            await db.query(
              'INSERT INTO Doctors (doctor_name, specialty, doctor_email, password) VALUES (?, ?, ?, ?)',
              [r.doctor_name, r.specialty, r.doctor_email, r.password]
            );
          }

          // Insertar location si tiene datos de location
          if (r.location_name) {
            await db.query(
              'INSERT INTO Locations (location_name) VALUES (?)',
              [r.location_name]
            );
          }

          // Insertar payment si tiene datos de payment
          if (r.payment_type) {
            await db.query(
              'INSERT INTO Payment_Methods (payment_type) VALUES (?)',
              [r.payment_type]
            );
          }

          // Insertar appointment si tiene datos completos de cita
          if (
            r.patient_id && r.doctor_id && r.appointment_date &&
            r.appointment_time && r.reason && r.location_id &&
            r.payment_id && r.status
          ) {
            await db.query(
              `INSERT INTO Appointments 
                (patient_id, doctor_id, appointment_date, appointment_time, reason, description, location_id, payment_id, status)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [r.patient_id, r.doctor_id, r.appointment_date, r.appointment_time, r.reason, r.description || null, r.location_id, r.payment_id, r.status]
            );
          }
        }
        fs.unlinkSync(filePath);
        res.json({ message: 'Datos cargados', total: rows.length });
      } catch (err) {
        console.error('Error insertando datos:', err.message);
        res.status(500).json({ message: 'Error al insertar datos', error: err.message });
      }
    })
    .on('error', (err) => {
      console.error('Error leyendo CSV:', err.message);
      res.status(500).json({ message: 'Error leyendo archivo', error: err.message });
    });
}

module.exports = { uploadCSV };
