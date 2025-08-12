const db = require('../config/db');

// Get all appointments
async function getAllAppointments(req, res) {
  console.log('getAllAppointments iniciado');
  try {
    const appointments = await db.query(`
      SELECT 
        a.appointment_id, a.appointment_date, a.appointment_time, a.reason, a.description, a.status,
        p.patient_id, p.patient_name,
        d.doctor_id, d.doctor_name,
        l.location_id, l.location_name,
        pm.payment_id, pm.payment_type
      FROM Appointments a
      JOIN Patients p ON a.patient_id = p.patient_id
      JOIN Doctors d ON a.doctor_id = d.doctor_id
      JOIN Locations l ON a.location_id = l.location_id
      JOIN Payment_Methods pm ON a.payment_id = pm.payment_id
      ORDER BY a.appointment_date, a.appointment_time
    `);
    console.log('Datos obtenidos:', appointments.length);
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Database error' });
  }
}

// Get appointment by id
async function getAppointment(req, res) {
  const { id } = req.params;
  console.log('getAppointment iniciado para ID:', id);
  try {
    const appointments = await db.query(`
      SELECT 
        a.appointment_id, a.appointment_date, a.appointment_time, a.reason, a.description, a.status,
        p.patient_id, p.patient_name,
        d.doctor_id, d.doctor_name,
        l.location_id, l.location_name,
        pm.payment_id, pm.payment_type
      FROM Appointments a
      JOIN Patients p ON a.patient_id = p.patient_id
      JOIN Doctors d ON a.doctor_id = d.doctor_id
      JOIN Locations l ON a.location_id = l.location_id
      JOIN Payment_Methods pm ON a.payment_id = pm.payment_id
      WHERE a.appointment_id = ?
    `, [id]);

    if (appointments.length === 0) {
      console.log('No se encontró la cita con ID:', id);
      return res.status(404).json({ message: 'Appointment not found' });
    }
    console.log('Cita encontrada:', appointments[0]);
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ message: 'Database error' });
  }
}

// Create new appointment
async function createAppointment(req, res) {
  console.log('createAppointment iniciado con datos:', req.body);

  try {
    const {
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      reason,
      description,
      location_id,
      payment_id,
      status
    } = req.body;

    // Validar campos obligatorios
    const requiredFields = [
      'patient_id',
      'doctor_id',
      'appointment_date',
      'appointment_time',
      'reason',
      'location_id',
      'payment_id',
      'status'
    ];

    for (const field of requiredFields) {
      if (!req.body[field]) {
        console.log(`Falta campo requerido: ${field}`);
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    // Insertar cita
    const result = await db.query(
      `INSERT INTO Appointments
       (patient_id, doctor_id, appointment_date, appointment_time, reason, description, location_id, payment_id, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time,
        reason,
        description || null,
        location_id,
        payment_id,
        status
      ]
    );

    console.log('Cita creada con ID:', result.insertId);
    res.status(201).json({ message: 'Appointment created', appointment_id: result.insertId });

  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Database error', details: error.message });
  }
}

// Update appointment by id
async function updateAppointment(req, res) {
  const { id } = req.params;
  console.log('updateAppointment iniciado para ID:', id, 'con datos:', req.body);
  try {
    const { patient_id, doctor_id, appointment_date, appointment_time, reason, description, location_id, payment_id, status } = req.body;

    if (!patient_id && !doctor_id && !appointment_date && !appointment_time && !reason && !description && !location_id && !payment_id && !status) {
      console.log('No hay campos para actualizar');
      return res.status(400).json({ message: 'At least one field must be provided to update' });
    }

    let query = 'UPDATE Appointments SET ';
    const params = [];
    if (patient_id) { query += 'patient_id = ?, '; params.push(patient_id); }
    if (doctor_id) { query += 'doctor_id = ?, '; params.push(doctor_id); }
    if (appointment_date) { query += 'appointment_date = ?, '; params.push(appointment_date); }
    if (appointment_time) { query += 'appointment_time = ?, '; params.push(appointment_time); }
    if (reason) { query += 'reason = ?, '; params.push(reason); }
    if (description) { query += 'description = ?, '; params.push(description); }
    if (location_id) { query += 'location_id = ?, '; params.push(location_id); }
    if (payment_id) { query += 'payment_id = ?, '; params.push(payment_id); }
    if (status) { query += 'status = ?, '; params.push(status); }

    query = query.slice(0, -2); // quita la última coma y espacio
    query += ' WHERE appointment_id = ?';
    params.push(id);

    const result = await db.query(query, params);

    if (result.affectedRows === 0) {
      console.log('No se encontró la cita para actualizar con ID:', id);
      return res.status(404).json({ message: 'Appointment not found' });
    }

    console.log('Cita actualizada:', id);
    res.json({ message: 'Appointment updated' });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ message: 'Database error', details: error.message });
  }
}

// Delete appointment by id
async function deleteAppointment(req, res) {
  const { id } = req.params;
  console.log('deleteAppointment iniciado para ID:', id);
  try {
    const result = await db.query('DELETE FROM Appointments WHERE appointment_id = ?', [id]);

    if (result.affectedRows === 0) {
      console.log('No se encontró la cita para eliminar con ID:', id);
      return res.status(404).json({ message: 'Appointment not found' });
    }

    console.log('Cita eliminada:', id);
    res.json({ message: 'Appointment deleted' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ message: 'Database error', details: error.message });
  }
}

module.exports = {
  getAllAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
