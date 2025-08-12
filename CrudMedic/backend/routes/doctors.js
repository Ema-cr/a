const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctors');

// GET -> Listar todos los doctores
router.get('/', doctorController.getAllDoctors);

// POST -> Crear un nuevo doctor
router.post('/', doctorController.createDoctor);

module.exports = router;