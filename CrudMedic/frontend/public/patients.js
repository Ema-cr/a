const API_URL = 'http://localhost:3000/patients';
const msg = document.getElementById('msg');
const table = document.getElementById('patientsTable');
const tbody = table.querySelector('tbody');
const form = document.getElementById('createPatientForm');

// Obtener todos los pacientes
async function getAll() {
  msg.textContent = 'Cargando pacientes...';
  table.style.display = 'none';
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error al obtener pacientes');
    const patients = await res.json();

    if (patients.length === 0) {
      msg.textContent = 'No hay pacientes registrados.';
      tbody.innerHTML = '';
      return;
    }

    tbody.innerHTML = patients.map(p => `
      <tr>
        <td>${p.patient_id}</td>
        <td>${p.patient_name}</td>
        <td>${p.patient_email}</td>
        <td>${p.patient_phone}</td>
      </tr>
    `).join('');

    msg.textContent = '';
    table.style.display = '';
  } catch (error) {
    msg.textContent = 'Error cargando pacientes.';
    console.error(error);
  }
}

// Crear nuevo paciente
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const patientData = Object.fromEntries(formData.entries());

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error creando paciente');
    }

    alert('Paciente creado con éxito');
    form.reset();
    getAll();
  } catch (error) {
    alert('Error: ' + error.message);
  }
});
