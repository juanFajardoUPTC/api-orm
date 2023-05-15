const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    if (new Date(user.exp * 1000) < new Date()) {
      console.log('TOKEN EXPIRADO');
      return res.sendStatus(401);
    }
    console.log('TOKEN VIGENTE');
    req.user = user;
    next();
  });
};

module.exports = verifyToken;