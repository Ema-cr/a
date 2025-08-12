const API_URL = 'http://localhost:3000/doctors';
const msg = document.getElementById('msg');
const table = document.getElementById('doctorsTable');
const tbody = table.querySelector('tbody');
const form = document.getElementById('createDoctorForm');

// Obtener todos los doctores
async function getAll() {
  msg.textContent = 'Cargando doctores...';
  table.style.display = 'none';
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error al obtener doctores');
    const doctors = await res.json();

    if (doctors.length === 0) {
      msg.textContent = 'No hay doctores registrados.';
      tbody.innerHTML = '';
      return;
    }

    tbody.innerHTML = doctors.map(d => `
      <tr>
        <td>${d.doctor_id}</td>
        <td>${d.doctor_name}</td>
        <td>${d.doctor_email}</td>
        <td>${d.specialty}</td>
        
      </tr>
    `).join('');

    msg.textContent = '';
    table.style.display = '';
  } catch (error) {
    msg.textContent = 'Error cargando doctores.';
    console.error(error);
  }
}

// Crear nuevo doctor
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const doctorData = Object.fromEntries(formData.entries());

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(doctorData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error creando doctor');
    }

    alert('Doctor creado con éxito');
    form.reset();
    getAll();
  } catch (error) {
    alert('Error: ' + error.message);
  }
});
