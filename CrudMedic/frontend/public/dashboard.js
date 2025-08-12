document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btn-doctors').addEventListener('click', async () => {
    await fetchAndShow('http://localhost:3000/doctors', 'Doctores');
  });

  document.getElementById('btn-patients').addEventListener('click', async () => {
    await fetchAndShow('http://localhost:3000/patients', 'Pacientes');
  });

  document.getElementById('btn-appointments').addEventListener('click', async () => {
    await fetchAndShow('http://localhost:3000/appointment', 'Citas');
  });
});

async function fetchAndShow(url, title) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = `<em>Cargando ${title}...</em>`;
  try {
    const res = await fetch(url, { credentials: 'include' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Error');
    resultDiv.innerHTML = `<h2>${title}</h2><pre>${JSON.stringify(data, null, 2)}</pre>`;
  } catch (err) {
    resultDiv.innerHTML = `<span style="color:red;">${err.message}</span>`;
  }
}