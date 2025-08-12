const form = document.getElementById('form');
const msg = document.getElementById('msg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.style.display = 'none';

  const body = {
    email: form.email.value.trim(),
    password: form.password.value,
    name: form.name.value.trim()
  };

  try {
    const res = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include'
    });

    const data = await res.json();

    if (!res.ok) {
      msg.className = 'msg err';
      msg.textContent = data.message || 'Error en registro';
      msg.style.display = 'block';
      return;
    }

    msg.className = 'msg ok';
    msg.textContent = 'Registro OK. ID: ' + (data.patient_id || 'n/a');
    msg.style.display = 'block';
    setTimeout(() => window.location.href = 'login.html', 1000);

  } catch (err) {
    msg.className = 'msg err';
    msg.textContent = 'Error conectando al servidor';
    msg.style.display = 'block';
  }
});
