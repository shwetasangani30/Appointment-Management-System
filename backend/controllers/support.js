const Joi = require("joi");
const { validation } = require("../common");
const { SupportSchema } = require("../models/supportModel");
const { verifyJwt } = require("../verification");

const add = async (req, res) => {
  try {
    const requestBody = req.body;

    const schema = Joi.object().keys({
      receiver_id: Joi.string().required(),
      message: Joi.string().required(),
      createdAt: Joi.date().required(),
    });

    let valid = validation(schema, requestBody, res);
    if (valid) {
      let user = verifyJwt(req, res);
      const dataToSave = new SupportSchema({
        sender_id: user?.user_id,
        receiver_id: requestBody.receiver_id,
        message: requestBody.message,
        createdAt: requestBody.createdAt,
      });
      try {
        await dataToSave.save();
        let response = {
          status: 200,
          message: "Message has been added.",
          data: dataToSave,
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

const getChats = (req, res) => {
  try {
    let user = verifyJwt(req, res);
    SupportSchema.find(
      { $or: [{ receiver_id: user?.user_id }, { sender_id: user?.user_id }] },
      function (err, messages) {
        if (!err) {
          let response = {
            status: 200,
            message: "Message list found",
            data: messages,
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
      .populate("sender_id", "name email role _id")
      .populate("receiver_id", "name email role _id");
  } catch (err) {
    console.log("err", err);
    let response = {
      status: 500,
      message: "Something went wrong!!",
      data: [],
    };
    res.status(500).send(response);
  }
};

const getMessages = (req, res) => {
  try {
    const requestBody = req.body;

    const schema = Joi.object().keys({
      sender_id: Joi.string().required(),
      receiver_id: Joi.string().required(),
    });

    let valid = validation(schema, requestBody, res);
    if (valid) {
      let user = verifyJwt(req, res);
      SupportSchema.find(
        {
          $or: [
            {
              $and: [
                { receiver_id: requestBody?.receiver_id },
                { sender_id: requestBody?.sender_id },
              ],
            },
            {
              $and: [
                { sender_id: requestBody?.receiver_id },
                { receiver_id: requestBody?.sender_id },
              ],
            },
          ],
        },
        function (err, messages) {
          if (!err) {
            let response = {
              status: 200,
              message: "Message list found",
              data: messages,
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
        .populate("sender_id", "name role _id")
        .populate("receiver_id", "name role _id")
        .sort({
          createdAt: 1, //Sort by Date Added DESC
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

module.exports = { add, getChats, getMessages };
