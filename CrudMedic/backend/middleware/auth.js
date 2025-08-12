function authMiddleware(req, res, next) {
  // Rutas públicas permitidas (ajusta según tus necesidades)
  const publicRoutes = [
    '/doctors',
    '/patients',
    '/appointment'
  ];

  // Permitir GET a rutas públicas y sus subrutas
  if (
    req.method === 'GET' &&
    publicRoutes.some(route => req.path.startsWith(route))
  ) {
    return next();
  }

  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: 'No autorizado' });
  }
  next();
}

module.exports = authMiddleware;
