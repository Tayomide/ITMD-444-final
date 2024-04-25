const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    req.isAuthenticated = false;
    return next();
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      req.isAuthenticated = false;
      return next();
    }
    req.isAuthenticated = true;
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
