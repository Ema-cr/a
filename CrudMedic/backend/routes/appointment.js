// routes/appointments.js
const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointment'); // Ajusta la ruta si tu archivo se llama distinto

// Obtener todas las citas
router.get('/', getAllAppointments);

// Obtener una cita por ID
router.get('/:id', getAppointment);

// Crear una nueva cita
router.post('/', createAppointment);

// Actualizar una cita por ID
router.put('/:id', updateAppointment);

// Eliminar una cita por ID
router.delete('/:id', deleteAppointment);

module.exports = router;
