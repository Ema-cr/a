// routes/patients.js
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patients');

// Obtener todos los pacientes
router.get('/', patientController.getAllPatients);

// Obtener un paciente por ID
router.get('/:id', patientController.getPatient);

// Crear un nuevo paciente
router.post('/', patientController.createPatient);

// Actualizar un paciente por ID
router.put('/:id', patientController.updatePatient);

// Eliminar un paciente por ID
router.delete('/:id', patientController.deletePatient);

module.exports = router;
