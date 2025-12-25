const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.headers.token?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token is required", status: "ERR" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(401).json({ 
        message: "Token expired or invalid",
        status: "ERR",
      })
    }
    // const { payload } = user;
    if (user?.isAdmin) {
      next();
    } else {
      return res.status(403).json({ 
        message: "You are not Admin",
        status: "ERR",
      });
    }
  });
};

const authUserMiddleware = (req, res, next) => {
    const token = req.headers.token?.split(" ") [1]
    const userID = req.params.id

    if (!token) {
    return res.status(401).json({ message: "Token is required", status: "ERR" });
  }

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
          return res.status(401).json({ 
            message: "Token expired or invalid",
            status: "ERR",
          });
        }
// const { payload } = user
    if (user?.isAdmin || user?.id === userID) {
        next();
        } else {
          return res.status(403).json({ 
            message: "Permission denied",
            status: "ERR",
        })
    }
});
}

module.exports = {
    authMiddleware,
    authUserMiddleware
}
