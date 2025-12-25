const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.headers.token.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        message: "The authemtication",
        status: "ERR",
      })
    }
    const { payload } = user;
    if (payload?.isAdmin) {
      next();
    } else {
      return res.status(404).json({
        message: "The authentication",
        status: "ERR",
      });
    }
  });
};

const authUserMiddleware = (req, res, next) => {
    const token = req.headers.token.split(' ') [1]
    const userID = req.params.id
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
const { payload } = user
    if (payload?.isAdmin || payload?.id === userID) {
        next()
        } else {
return res.status(404).json({
message: 'The authentication',
status: 'ERROR'
        })
    }
});
}

module.exports = {
    authMiddleware,
    authUserMiddleware
}
