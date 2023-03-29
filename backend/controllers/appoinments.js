const Joi = require("joi");
const { validation, sendMail } = require("../common");
const { AppointmentSchema } = require("../models/appointmentModel");
const { UserSchema } = require("../models/usermodel");
const { verifyJwt } = require("../verification");

const add = async (req, res) => {
  try {
    const requestBody = req.body;

    const schema = Joi.object().keys({
      appointee: Joi.string().required(),
      package: Joi.string().required(),
      description: Joi.string().required(),
      slot: Joi.object().required(),
    });

    let valid = validation(schema, requestBody, res);
    if (valid) {
      let user = verifyJwt(req, res);
      const dataToSave = new AppointmentSchema({
        clientId: user?.user_id,
        appointeeId: requestBody.appointee,
        packageId: requestBody.package,
        description: requestBody.description,
        appointmentDate: requestBody?.slot?.date,
        appointmentTime: requestBody?.slot?.time,
        status: 0,
      });

      try {
        await dataToSave.save();
        let response = {
          status: 200,
          message: "Appointment has been added.",
          data: [],
        };
        res.status(200).send(response);
      } catch (error) {
        res.status(500).send({
          status: 500,
          message: error.message,
          data: [],
        });
      }
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

const update = (req, res) => {
  try {
    const requestBody = req.body;

    const schema = Joi.object().keys({
      id: Joi.string().required(),
      appointee: Joi.string().required(),
      package: Joi.string().required(),
      description: Joi.string().required(),
      slot: Joi.object().required(),
    });

    let valid = validation(schema, requestBody, res);
    if (valid) {
      AppointmentSchema.findOneAndUpdate(
        { _id: requestBody?.id },
        {
          description: requestBody?.description,
          appointmentDate: requestBody?.slot?.date,
          appointmentTime: requestBody?.slot?.time,
          updatedAt: new Date(),
        }
      ).then(async (appoinment) => {
        if (appoinment) {
          try {
            let findrecord = await UserSchema.findOne({
              _id: appoinment?.clientId,
            });
            let appointmentDate = new Date(appoinment?.appointmentDate);
            let date, month, year;
            date = appointmentDate.getDate();
            month = appointmentDate.getMonth() + 1;
            year = appointmentDate.getFullYear();
            date = date.toString().padStart(2, "0");
            month = month.toString().padStart(2, "0");
            let message =
              "Dear " +
              findrecord?.name +
              ",<br/> Your appointment time has been changed you can check date and time below. <br/>" +
              "Scheduled date: " +
              `${date}/${month}/${year}` +
              "<br/>Scheduled Time Slot: " +
              appoinment?.appointmentTime;

            let subject = "Appointment Updated - " + process.env.APPNAME;
            let info = sendMail(findrecord?.email, subject, message);

            info.then(async function (result) {
              if (result) {
                let response = {
                  status: 200,
                  message: "Request has been updated",
                  data: [],
                };
                res.status(200).send(response);
              } else {
                let response = {
                  status: 500,
                  message: "Something went wrong while email sending.",
                  data: [],
                };
                res.status(500).send(response);
              }
            });
          } catch (error) {
            res.status(500).send({
              status: 500,
              message: error.message,
              data: [],
            });
          }
          let response = {
            status: 200,
            message: "Appointment has been updated",
            data: [],
          };
          res.status(200).send(response);
        } else {
          res.status(400).send({
            status: 400,
            message: "Appointment not found",
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

const getById = (req, res) => {
  try {
    let params = req?.params;
    AppointmentSchema.findOne({ _id: params?.id }, function (err, appo) {
      if (!err) {
        let response = {
          status: 200,
          message: "appointment found",
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
      .populate("clientId", "name _id")
      .populate("appointeeId", "name _id")
      .populate("packageId", "name description _id")
      .populate("approvedBy", "name -_id")
      .populate("rejectedBy", "name -_id")
      .populate("cancelledBy", "name -_id")
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

const getAllByUser = (req, res) => {
  try {
    let user = verifyJwt(req, res);
    AppointmentSchema.find({ clientId: user?.user_id }, function (err, appo) {
      if (!err) {
        let response = {
          status: 200,
          message: "appointment list found",
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
      .populate("clientId", "name -_id")
      .populate("appointeeId", "name -_id")
      .populate("packageId", "name description -_id")
      .populate("approvedBy", "name -_id")
      .populate("rejectedBy", "name -_id")
      .populate("cancelledBy", "name -_id")
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

const getByStatus = (req, res) => {
  try {
    const requestBody = req.body;
    AppointmentSchema.find(
      { status: { $in: requestBody?.status } },
      function (err, appo) {
        if (!err) {
          let response = {
            status: 200,
            message: "Appointment list found",
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
    )
      .populate("clientId", "name -_id")
      .populate("appointeeId", "name -_id")
      .populate("packageId", "name description -_id")
      .populate("approvedBy", "name -_id")
      .populate("rejectedBy", "name -_id")
      .populate("cancelledBy", "name -_id")
      .sort({
        createdAt: -1, // Sort by Date Added DESC
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

const getPendingApprovedByDate = (req, res) => {
  try {
    const requestBody = req.body;
    AppointmentSchema.find(
      {
        appointeeId: requestBody?.appointeeId,
        status: { $in: [0, 1] },
        appointmentDate: { $gte: new Date(requestBody?.appointmentDate) },
      },
      function (err, appo) {
        if (!err) {
          let response = {
            status: 200,
            message: "Appointment list found",
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
    )
      .populate("clientId", "name -_id")
      .populate("appointeeId", "name -_id")
      .populate("packageId", "name description -_id")
      .populate("approvedBy", "name -_id")
      .populate("rejectedBy", "name -_id")
      .populate("cancelledBy", "name -_id")
      .sort({
        createdAt: -1, // Sort by Date Added DESC
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

const updateStatus = (req, res) => {
  try {
    const requestBody = req.body;
    const schema = Joi.object().keys({
      id: Joi.string().required(),
      status: Joi.required(),
      cancelReason: Joi.string(),
      rejectReason: Joi.string(),
    });
    let valid = validation(schema, requestBody, res);
    if (valid) {
      let user = verifyJwt(req, res);
      AppointmentSchema.findOneAndUpdate(
        { _id: requestBody?.id },
        {
          status: requestBody?.status,
          approvedBy: requestBody?.status === 1 ? user?.user_id : null,
          rejectedBy: requestBody?.status === 2 ? user?.user_id : null,
          cancelledBy: requestBody?.status === 3 ? user?.user_id : null,
          cancelReason: requestBody?.cancelReason
            ? requestBody?.cancelReason
            : "",
          rejectReason: requestBody?.rejectReason
            ? requestBody?.rejectReason
            : "",
          updatedAt: new Date(),
        }
      ).then(async (appoinment) => {
        if (appoinment) {
          var text;
          var text1;
          var email;
          var name;
          var reason;
          if (requestBody?.status === 3) {
            text = "cancelled";
            text1 = " by you.";
            email = user?.email;
            name = user?.name;
            reason = " Reason for cancellation: " + requestBody?.cancelReason;
          } else if (requestBody?.status === 2) {
            await UserSchema.findOne({ _id: appoinment?.clientId }).then(
              (findrecord) => {
                if (findrecord) {
                  text = "rejected";
                  text1 =
                    " by <a href='mailto:" +
                    user?.email +
                    "'>" +
                    user?.name +
                    "</a>.";
                  email = findrecord?.email;
                  name = findrecord?.name;
                  reason =
                    " Reason for rejection: " + requestBody?.rejectReason;
                }
              }
            );
          } else {
            await UserSchema.findOne({ _id: appoinment?.clientId }).then(
              (findrecord) => {
                if (findrecord) {
                  let appointmentDate = new Date(appoinment?.appointmentDate);
                  let date, month, year;
                  date = appointmentDate.getDate();
                  month = appointmentDate.getMonth() + 1;
                  year = appointmentDate.getFullYear();
                  date = date.toString().padStart(2, "0");
                  month = month.toString().padStart(2, "0");

                  text = "approved";
                  text1 =
                    " by <a href='mailto:" +
                    user?.email +
                    "'>" +
                    user?.name +
                    "</a>.";
                  email = findrecord?.email;
                  name = findrecord?.name;
                  reason =
                    "Scheduled date: " +
                    `${date}/${month}/${year}` +
                    "<br/>Scheduled Time Slot: " +
                    appoinment?.appointmentTime;
                }
              }
            );
          }
          try {
            let message =
              "Dear " +
              name +
              ",<br/> Your appointment has been " +
              text +
              text1 +
              "<br/>" +
              reason;

            let subject = "Appointment " + text + " - " + process.env.APPNAME;
            let info = sendMail(email, subject, message);

            info.then(async function (result) {
              if (result) {
                let response = {
                  status: 200,
                  message: "Request has been updated",
                  data: [],
                };
                res.status(200).send(response);
              } else {
                let response = {
                  status: 500,
                  message: "Something went wrong while email sending.",
                  data: [],
                };
                res.status(500).send(response);
              }
            });
          } catch (error) {
            res.status(500).send({
              status: 500,
              message: error.message,
              data: [],
            });
          }
        } else {
          res.status(400).send({
            status: 400,
            message: "Appointment not found",
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

const getAllByAppointee = (req, res) => {
  try {
    let user = verifyJwt(req, res);
    AppointmentSchema.find(
      { appointeeId: user?.user_id },
      function (err, appo) {
        if (!err) {
          let response = {
            status: 200,
            message: "appointment list found",
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
    )
      .populate("clientId", "name -_id")
      .populate("appointeeId", "name -_id")
      .populate("packageId", "name description -_id")
      .populate("approvedBy", "name -_id")
      .populate("rejectedBy", "name -_id")
      .populate("cancelledBy", "name -_id")
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

module.exports = {
  add,
  update,
  getById,
  getAllByUser,
  getByStatus,
  getPendingApprovedByDate,
  updateStatus,
  getAllByAppointee,
};
