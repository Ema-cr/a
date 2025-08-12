document.getElementById('uploadBtn').addEventListener('click', () => {
  const input = document.getElementById('fileInput');
  const file = input.files[0];

  if (!file) {
    alert('Por favor selecciona un archivo CSV');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  const statusDiv = document.getElementById('status');
  statusDiv.textContent = 'Subiendo archivo...';

  fetch('http://localhost:3000/charge/upload-csv', {
    method: 'POST',
    body: formData
  })
  .then(res => {
    if (!res.ok) throw new Error('Error en la subida');
    return res.json();
  })
  .then(data => {
    statusDiv.textContent = `Archivo procesado. Filas insertadas: ${data.total}`;
  })
  .catch(err => {
    console.error(err);
    statusDiv.textContent = 'Error subiendo archivo.';
  });
});
