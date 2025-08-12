const db = require('../config/db.js');

// Listar todos los pacientes
async function getAllPatients(req, res) {
  try {
    const patients = await db.query('SELECT patient_id, patient_name, patient_email FROM Patients');
    res.json(patients);
  } catch (error) {
    console.error('Error obteniendo pacientes:', error);
    res.status(500).json({ message: 'Error en la base de datos' });
  }
}

async function getPatient(req, res) {
  try {
    const patients = await db.query('SELECT * FROM Patients WHERE patient_id = ?', [req.params.id]);
    res.json(patients);
  } catch (error) {
    console.error('Error obteniendo pacientes:', error);
    res.status(500).json({ message: 'Error en la base de datos' });
  }
}

// Crear nuevo paciente sin hash
async function createPatient(req, res) {
  try {
    const { patient_name, patient_email, password } = req.body;

    if (!patient_name || !patient_email || !password) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }

    const result = await db.query(
      'INSERT INTO Patients (patient_name, patient_email, password) VALUES (?, ?, ?)',
      [patient_name, patient_email, password]
    );

    res.status(201).json({ message: 'Paciente creado', patient_id: result.insertId });
  } catch (error) {
    console.error('Error creando paciente:', error);
    res.status(500).json({ message: 'Error en la base de datos', details: error.message });
  }
}

// Editar paciente (por id) sin hash
async function updatePatient(req, res) {
  try {
    const { id } = req.params;
    const { patient_name, patient_email, password } = req.body;

    if (!patient_name && !patient_email && !password) {
      return res.status(400).json({ message: 'Debe enviar al menos un campo para actualizar' });
    }

    let query = 'UPDATE Patients SET ';
    const params = [];

    if (patient_name) {
      query += 'patient_name = ?, ';
      params.push(patient_name);
    }
    if (patient_email) {
      query += 'patient_email = ?, ';
      params.push(patient_email);
    }
    if (password) {
      query += 'password = ?, ';
      params.push(password);
    }

    query = query.slice(0, -2); // quitar la última coma y espacio
    query += ' WHERE patient_id = ?';
    params.push(id);

    const result = await db.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    res.json({ message: 'Paciente actualizado' });
  } catch (error) {
    console.error('Error actualizando paciente:', error);
    res.status(500).json({ message: 'Error en la base de datos', details: error.message });
  }
}

// Eliminar paciente (por id)
async function deletePatient(req, res) {
  try {
    const { id } = req.params;

    const result = await db.query('DELETE FROM Patients WHERE patient_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    res.json({ message: 'Paciente eliminado' });
  } catch (error) {
    console.error('Error eliminando paciente:', error);
    res.status(500).json({ message: 'Error en la base de datos', details: error.message });
  }
}

module.exports = {
  getAllPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
};
