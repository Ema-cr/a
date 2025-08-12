const db = require('../config/db'); // conexión con mysql2/promise

// LOGIN
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  try {
    let rows;

    // Buscar primero en Doctors
    const [doctorRows] = await db.query(
      'SELECT doctor_id AS id, doctor_email AS email, password, "doctor" AS role FROM Doctors WHERE doctor_email = ?',
      [email]
    );
    rows = doctorRows;

    // Si no está en Doctors, buscar en Patients
    if (!rows || rows.length === 0) {
      const [patientRows] = await db.query(
        'SELECT patient_id AS id, patient_email AS email, password, "patient" AS role FROM Patients WHERE patient_email = ?',
        [email]
      );
      rows = patientRows;
    }

    // Validar si no se encontró usuario
    if (!rows || rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales no validas' });
    }

    const user = rows;

    // Validar si no existe password en el resultado
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Credenciales falsas' });
    }

    // Comparar contraseñas (texto plano)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Guardar sesión
    req.session.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    res.json({ message: 'Login exitoso', role: user.role });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

// REGISTER
async function register(req, res) {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  try {
    // Buscar en Doctors
    const doctorRows = await db.query(
      'SELECT doctor_id FROM Doctors WHERE doctor_email = ?',
      [email]
    );
    if (doctorRows.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Buscar en Patients
    const patientRows = await db.query(
      'SELECT patient_id FROM Patients WHERE patient_email = ?',
      [email]
    );
    if (patientRows.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Insertar nuevo paciente
    const insertResult = await db.query(
      'INSERT INTO Patients (patient_email, password, patient_name) VALUES (?, ?, ?)',
      [email, password, name]
    );

    // Si insertResult tiene insertId, lo retornamos; si no, error
    if (!insertResult || typeof insertResult.insertId === 'undefined') {
      return res.status(500).json({ message: 'No se pudo registrar el usuario' });
    }

    return res.status(201).json({
      message: 'Usuario registrado',
      patient_id: insertResult.insertId,
      role: 'patient'
    });

  } catch (error) {
    console.error('Error en registro:', error.message, error);
    return res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
}



// LOGOUT
async function logout(req, res) {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Error cerrando sesión' });
    }
    res.json({ message: 'Sesión cerrada' });
  });
}

module.exports = { login, register, logout };
