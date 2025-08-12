require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');

const authMiddleware = require('./middleware/auth');

// Importar rutas
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');
const chargeRoutes = require('./routes/charge');
const appointmentRoutes = require('./routes/appointment');


const app = express();
const PORT = process.env.PORT || 3000;

// CORS
app.use(cors({
  origin: 'http://localhost:5500', // puerto del front
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultsecret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // para pruebas en local
}));

// Rutas
app.use('/auth', authRoutes);
app.use('/patients', patientRoutes);
app.use('/doctors', doctorRoutes);
app.use('/charge', chargeRoutes);
app.use('/appointments', appointmentRoutes);

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
