const jwt = require('jsonwebtoken');
const JWT_SEC = "HeartPredictdevops$dege";

const fetchuser = (req, res, next) => {
  const token = req.header('auth-token');
  
  if (!token) {
    return res.status(401).json({ error: 'Please authenticate using a valid token' });
  }

  try {
    const data = jwt.verify(token, JWT_SEC);
    req.user = data.user;
    next(); 
  } catch (err) {
    return res.status(401).json({ error: 'Please authenticate using a valid token' });
  }
};

module.exports = fetchuser;
