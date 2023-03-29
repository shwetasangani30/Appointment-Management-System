const Joi = require("joi");
const { validation } = require("../common");
const { PackageSchema } = require("../models/packageModel");
const { verifyJwt } = require("../verification");

const add = (req, res) => {
  try {
    const requestBody = req.body;

    const schema = Joi.object().keys({
      name: Joi.string().required(),
      description: Joi.string().required(),
    });

    let valid = validation(schema, requestBody, res);
    if (valid) {
      let user = verifyJwt(req, res);
      PackageSchema.findOne({ name: requestBody.name, isDeleted: 0 }).then(
        async (findrecord) => {
          if (findrecord) {
            res.status(500).send({
              status: 500,
              message: "Package name already exist",
              data: {
                name: requestBody.name,
                description: requestBody.description,
              },
            });
          } else {
            const dataToSave = new PackageSchema({
              name: requestBody.name,
              description: requestBody.description,
              user_id: user?.user_id,
            });

            try {
              await dataToSave.save();
              let response = {
                status: 200,
                message: "Package has been added.",
                data: {
                  name: requestBody.name,
                  description: requestBody.description,
                },
              };
              res.status(200).send(response);
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

const getAllByUser = (req, res) => {
  try {
    let user = verifyJwt(req, res);
    PackageSchema.find(
      { user_id: user?.user_id, isDeleted: 0 },
      function (err, appo) {
        if (!err) {
          let response = {
            status: 200,
            message: "Package list found",
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
      }
    ).sort({
      createdAt: -1, //Sort by Date Added DESC
    });
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
    PackageSchema.find({ isDeleted: 0 }, function (err, appo) {
      if (!err) {
        let response = {
          status: 200,
          message: "Package list found",
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
    })
      .populate("user_id", "name -_id")
      .sort({
        createdAt: -1, //Sort by Date Added DESC
      });
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
      description: Joi.string().required(),
    });
    let valid = validation(schema, requestBody, res);
    if (valid) {
      PackageSchema.findOne({ _id: requestBody.id, isDeleted: 0 }).then(
        (findrecord) => {
          if (findrecord) {
            PackageSchema.updateOne(
              { _id: requestBody.id }, // Filter
              {
                $set: {
                  name: requestBody.name,
                  description: requestBody.description,
                  updatedAt: new Date(),
                },
              } // Update
            ).then(() => {
              let response = {
                status: 200,
                message: "Package has been updated",
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

const deletePackage = (req, res) => {
  try {
    const schema = Joi.object().keys({
      id: Joi.string().required(),
    });
    let valid = validation(schema, req?.params, res);
    if (valid) {
      const id = req?.params?.id;
      PackageSchema.findOneAndUpdate(
        { _id: id, isDeleted: 0 },
        { isDeleted: 1, deletedAt: new Date() }
      ).then((user) => {
        if (user) {
          let response = {
            status: 200,
            message: "Package has been deleted",
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
      PackageSchema.findOneAndUpdate(
        { _id: requestBody?.id, isDeleted: 0 },
        { status: requestBody?.status, updatedAt: new Date() }
      ).then((user) => {
        if (user) {
          let response = {
            status: 200,
            message: requestBody?.status
              ? "Package has been activated"
              : "Package has been deactivated",
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

const getByAppointee = (req, res) => {
  try {
    PackageSchema.find(
      { user_id: req?.body?.id, isDeleted: 0 },
      function (err, appo) {
        if (!err) {
          let response = {
            status: 200,
            message: "Package list found",
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
      }
    ).sort({
      createdAt: -1, //Sort by Date Added DESC
    });
  } catch (err) {
    let response = {
      status: 500,
      message: "Something went wrong!!",
      data: [],
    };
    res.status(500).send(response);
  }
};

const getPackageyId = (req, res) => {
  try {
    const schema = Joi.object().keys({
      id: Joi.string().required(),
    });
    let valid = validation(schema, req.params, res);
    if (valid) {
      const id = req?.params?.id;
      PackageSchema.findOne({ _id: id, isDeleted: 0 }, function (err, data) {
        if (data) {
          let response = {
            status: 200,
            message: "Package found",
            data: data,
          };
          res.status(200).send(response);
        } else {
          let response = {
            status: 400,
            message: "Package not found",
            data: [],
          };
          res.status(400).send(response);
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

module.exports = {
  add,
  getAllByUser,
  getAll,
  update,
  deletePackage,
  updateStatus,
  getPackageyId,
  getByAppointee,
};
