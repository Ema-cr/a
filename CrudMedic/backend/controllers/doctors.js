const db = require('../config/db');

// Listar todos los doctores
async function getAllDoctors(req, res) {
  try {
    const doctors = await db.query('SELECT doctor_id, doctor_name, doctor_email, specialty FROM Doctors');
    res.json(doctors);
  } catch (error) {
    console.error('Error obteniendo doctores:', error);
    res.status(500).json({ message: 'Error en la base de datos' });
  }
}

// Crear nuevo doctor con password sin hasheo
async function createDoctor(req, res) {
  try {
    const { doctor_name, doctor_email, specialty, password } = req.body;

    if (!doctor_name || !doctor_email || !specialty || !password) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    // Sin hasheo, password directo
    const result = await db.query(
      'INSERT INTO Doctors (doctor_name, doctor_email, specialty, password) VALUES (?, ?, ?, ?)',
      [doctor_name, doctor_email, specialty, password]
    );

    res.status(201).json({ message: 'Doctor creado', doctor_id: result.insertId });
  } catch (error) {
    console.error('Error creando doctor:', error);
    res.status(500).json({ message: 'Error en la base de datos', details: error.message });
  }
}

module.exports = {
  getAllDoctors,
  createDoctor,
};
