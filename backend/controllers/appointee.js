const Joi = require("joi");
const { generatePassword, validation, sendMail } = require("../common");
const { UserSchema } = require("../models/usermodel");

const add = (req, res) => {
  try {
    const requestBody = req.body;

    const schema = Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
    });

    let valid = validation(schema, requestBody, res);
    if (valid) {
      UserSchema.findOne({ email: requestBody.email, isDeleted: 0 }).then(
        (findrecord) => {
          if (findrecord) {
            res.status(500).send({
              status: 500,
              message: "Email already exist.",
              data: { name: requestBody.name, email: requestBody.email },
            });
          } else {
            var password = generatePassword(8);
            const dataToSave = new UserSchema({
              name: requestBody.name,
              email: requestBody.email,
              password: password,
              role: 2,
              token: null,
            });

            try {
              let message =
                "Dear " +
                requestBody.name +
                ",<br/> You have been added to " +
                process.env.APPNAME +
                " You can login to system by using below credentials. <br/> Email: " +
                requestBody.email +
                "<br/> Password: " +
                password +
                "";
              let subject = "Appointee added - " + process.env.APPNAME;
              let info = sendMail(requestBody.email, subject, message);

              info.then(async function (result) {
                if (result) {
                  await dataToSave.save();
                  let response = {
                    status: 200,
                    message: "Appointee has been added.",
                    data: { name: requestBody.name, email: requestBody.email },
                  };
                  res.status(200).send(response);
                } else {
                  let response = {
                    status: 500,
                    message: "Something went wrong while email sending.",
                    data: { name: requestBody.name, email: requestBody.email },
                  };
                  res.status(500).send(response);
                }
              });
            } catch (error) {
              res.status(500).send({
                status: 500,
                message: error.message,
                data: { name: requestBody.name, email: requestBody.email },
              });
            }
          }
        }
      );
    }
  } catch (err) {
    let response = {
      status: 500,
      message: "Something went wrong!!",
      data: [],
    };
    res.status(500).send(response);
  }
};

const getAll = (req, res) => {
  try {
    UserSchema.find({ role: 2, isDeleted: 0 }, function (err, appo) {
      if (!err) {
        let response = {
          status: 200,
          message: "Appointee list found",
          data: appo,
        };
        res.status(200).send(response);
      } else {
        let response = {
          status: 500,
          message: "Something went wrong!!",
          data: [],
        };
        res.status(500).send(response);
      }
    }).select("name email createdAt status isBlocked");
  } catch (err) {
    let response = {
      status: 500,
      message: "Something went wrong!!",
      data: [],
    };
    res.status(500).send(response);
  }
};

const update = (req, res) => {
  try {
    const requestBody = req.body;

    const schema = Joi.object().keys({
      id: Joi.required(),
      name: Joi.string().required(),
    });
    let valid = validation(schema, requestBody, res);
    if (valid) {
      UserSchema.findOne({ _id: requestBody.id, isDeleted: 0 }).then(
        (findrecord) => {
          if (findrecord) {
            UserSchema.updateOne(
              { _id: requestBody.id }, // Filter
              { $set: { name: requestBody.name, updatedAt: new Date() } } // Update
            ).then(() => {
              let response = {
                status: 200,
                message: "Appointee has been updated",
                data: [],
              };
              res.status(200).send(response);
            });
          } else {
            res.status(400).send({
              status: 400,
              message: "User not found",
              data: [],
            });
          }
        }
      );
    }
  } catch (err) {
    let response = {
      status: 500,
      message: "Something went wrong!!",
      data: [],
    };
    res.status(500).send(response);
  }
};

const deleteAppointee = (req, res) => {
  try {
    const schema = Joi.object().keys({
      id: Joi.string().required(),
    });
    let valid = validation(schema, req?.params, res);
    if (valid) {
      const id = req?.params?.id;
      UserSchema.findOneAndUpdate(
        { _id: id, isDeleted: 0 },
        { isDeleted: 1, deletedAt: new Date() }
      ).then((user) => {
        if (user) {
          let response = {
            status: 200,
            message: "Appointee has been deleted",
            data: [],
          };
          res.status(200).send(response);
        } else {
          res.status(400).send({
            status: 400,
            message: "User not found",
            data: [],
          });
        }
      });
    }
  } catch (err) {
    let response = {
      status: 500,
      message: "Something went wrong!!",
      data: [],
    };
    res.status(500).send(response);
  }
};

const updateStatus = (req, res) => {
  try {
    const requestBody = req?.body;
    const schema = Joi.object().keys({
      id: Joi.string().required(),
      status: Joi.required(),
    });
    let valid = validation(schema, requestBody, res);
    if (valid) {
      UserSchema.findOneAndUpdate(
        { _id: requestBody?.id, isDeleted: 0 },
        { status: requestBody?.status, updatedAt: new Date() }
      ).then((user) => {
        if (user) {
          let response = {
            status: 200,
            message: requestBody?.status
              ? "Appointee has been activated"
              : "Appointee has been deactivated",
            data: [],
          };
          res.status(200).send(response);
        } else {
          res.status(400).send({
            status: 400,
            message: "User not found",
            data: [],
          });
        }
      });
    }
  } catch (err) {
    let response = {
      status: 500,
      message: "Something went wrong!!",
      data: [],
    };
    res.status(500).send(response);
  }
};

module.exports = { add, getAll, update, deleteAppointee, updateStatus };
