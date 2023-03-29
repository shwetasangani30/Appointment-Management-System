const jwt = require("jsonwebtoken");

const verifyRouteJwt = (req, res, next) => {
  const token = req.headers.authorization;
  const jwtSecretKey = process.env.TOKEN_KEY;
  try {
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      next();
    } else {
      return res.status(401).send({
        status: 401,
        message: "Unauthorized!!. Token has been Expired.",
        data: [],
      });
    }
  } catch (err) {
    return res.status(401).send({
      status: 401,
      message: "Unauthorized!!. Token has been Expired.",
      data: [],
    });
  }
};

const verifyJwt = (req, res) => {
  const token = req.headers.authorization;
  const jwtSecretKey = process.env.TOKEN_KEY;
  try {
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      return verified;
    } else {
      return res.status(401).send({
        status: 401,
        message: "Unauthorized!!. Token has been Expired.",
        data: [],
      });
    }
  } catch (err) {
    return res.status(401).send({
      status: 401,
      message: "Unauthorized!!. Token has been Expired.",
      data: [],
    });
  }
};

const isAdmin = (req, res, next) => {
  let jwtCheck = verifyJwt(req, res);
  if (jwtCheck && jwtCheck?.role === 1) {
    next();
  } else {
    return res.status(401).send({
      status: 401,
      message: "Unauthorized!!. You are not an admin.",
      data: [],
    });
  }
};

const isAppointee = (req, res, next) => {
  let jwtCheck = verifyJwt(req, res);
  if (jwtCheck && jwtCheck?.role === 2) {
    next();
  } else {
    return res.status(401).send({
      status: 401,
      message: "Unauthorized!!. You are not an appointee.",
      data: [],
    });
  }
};

const isClient = (req, res, next) => {
  let jwtCheck = verifyJwt(req, res);
  if (jwtCheck && jwtCheck?.role === 3) {
    next();
  } else {
    return res.status(401).send({
      status: 401,
      message: "Unauthorized!!. You are not a client.",
      data: [],
    });
  }
};

const isAppointeeClient = (req, res, next) => {
  let jwtCheck = verifyJwt(req, res);
  if (jwtCheck && (jwtCheck?.role === 2 || jwtCheck?.role === 3)) {
    next();
  } else {
    return res.status(401).send({
      status: 401,
      message: "Unauthorized!!. You are not an appointee or client.",
      data: [],
    });
  }
};

const isAdminClient = (req, res, next) => {
  let jwtCheck = verifyJwt(req, res);
  if (jwtCheck && (jwtCheck?.role === 1 || jwtCheck?.role === 3)) {
    next();
  } else {
    return res.status(401).send({
      status: 401,
      message: "Unauthorized!!. You are not an admin or client.",
      data: [],
    });
  }
};

const isAdminAppointee = (req, res, next) => {
  let jwtCheck = verifyJwt(req, res);
  if (jwtCheck && (jwtCheck?.role === 1 || jwtCheck?.role === 2)) {
    next();
  } else {
    return res.status(401).send({
      status: 401,
      message: "Unauthorized!!. You are not an admin or client.",
      data: [],
    });
  }
};

module.exports = {
  verifyRouteJwt,
  verifyJwt,
  isAdmin,
  isAppointee,
  isClient,
  isAppointeeClient,
  isAdminClient,
  isAdminAppointee,
};
