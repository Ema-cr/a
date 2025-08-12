document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault(); // Evita el refresh

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const message = document.getElementById('message');

  // Validación rápida antes de mandar
  if (!email || !password) {
    message.textContent = 'Poné el email y la contraseña primero';
    message.style.color = 'red';
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Para que se manden cookies si las hay
      body: JSON.stringify({ email, password })
    });

    // Verificar que la respuesta sea JSON antes de parsear
    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error('Respuesta inválida del servidor');
    }

    if (!res.ok) {
      message.textContent = data.message || 'Email o contraseña incorrectos';
      message.style.color = 'red';
      return;
    }

    message.textContent = '✅ Login exitoso, entrando...';
    message.style.color = 'green';

    // Guardar token si lo devuelve
    if (data.token) {
      localStorage.setItem('token', data.token);
      console.log('Token guardado:', data.token);
    }

    // Redirigir después de 1 segundo
    setTimeout(() => {
      window.location.href = '/home.html';
    }, 1000);

  } catch (error) {
    console.error(error);
    message.textContent = 'No se pudo conectar al servidor 😢';
    message.style.color = 'red';
  }
});
