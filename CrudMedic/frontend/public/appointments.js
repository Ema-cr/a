const msg = document.getElementById('msg');
const table = document.getElementById('appointmentsTable');
const tbody = table.querySelector('tbody');
const form = document.getElementById('createAppointmentForm');

const API_URL = 'http://localhost:3000/appointments';

// Obtener todas las citas
async function getAppointments() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al obtener citas');
  return await res.json();
}

// Crear nueva cita
async function createAppointment(data) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error creando cita');
  }
  return await res.json();
}

// Eliminar cita
async function deleteAppointment(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error eliminando cita');
  }
  return await res.json();
}

// Cargar y mostrar todas las citas en la tabla
async function loadAppointments() {
  msg.textContent = 'Cargando citas...';
  table.style.display = 'none';
  try {
    const appointments = await getAppointments();
    if (appointments.length === 0) {
      msg.textContent = 'No hay citas registradas.';
      tbody.innerHTML = '';
      return;
    }
    tbody.innerHTML = appointments
      .map(
        (a) => `
      <tr data-id="${a.appointment_id}">
        <td>${a.appointment_id}</td>
        <td>${a.patient_name || a.patient_id}</td>
        <td>${a.doctor_name || a.doctor_id}</td>
        <td>${a.appointment_date}</td>
        <td>${a.appointment_time}</td>
        <td>${a.reason}</td>
        <td>${a.description || ''}</td>
        <td>${a.location_id}</td>
        <td>${a.payment_id}</td>
        <td>${a.status}</td>
        <td>
          <button onclick="handleEdit(${a.appointment_id})">Editar</button>
          <button onclick="handleDelete(${a.appointment_id})">Eliminar</button>
        </td>
      </tr>
    `
      )
      .join('');
    msg.textContent = '';
    table.style.display = '';
  } catch (error) {
    msg.textContent = 'Error cargando citas.';
    console.error(error);
  }
}

// Manejar submit para crear cita
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const appointmentData = Object.fromEntries(formData.entries());

  try {
    await createAppointment(appointmentData);
    form.reset();
    loadAppointments();
  } catch (error) {
    alert('Error creando cita: ' + error.message);
  }
});

// Eliminar cita con confirmación
async function handleDelete(id) {
  if (!confirm('¿Seguro que quieres eliminar esta cita?')) return;
  try {
    await deleteAppointment(id);
    loadAppointments();
  } catch (error) {
    alert('Error eliminando cita: ' + error.message);
  }
}

// Placeholder para editar
function handleEdit(id) {
  alert('Función de editar no implementada aún para cita ID ' + id);
}

// Carga inicial
loadAppointments();
