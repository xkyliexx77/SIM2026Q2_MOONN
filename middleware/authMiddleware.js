const jwt = require('jsonwebtoken');

const SECRET_KEY = 'fundraising_secret_key';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function roleMiddleware(allowedRoles) {
  return function (req, res, next) {
    const userRole = String(req.user?.role || '').toLowerCase().trim();

    const rolesAllowed = allowedRoles.map(role =>
      String(role).toLowerCase().trim()
    );

    if (!userRole || !rolesAllowed.includes(userRole)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  };
}

module.exports = {
  authMiddleware,
  roleMiddleware,
  SECRET_KEY
};