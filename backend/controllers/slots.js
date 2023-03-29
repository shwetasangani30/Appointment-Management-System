const Joi = require("joi");
const { validation } = require("../common");
const { verifyJwt } = require("../verification");
const { SlotSchema } = require("../models/slotsModel");

const addUpdate = (req, res) => {
  try {
    const requestBody = req.body;
    const schema = Joi.array().items(
      Joi.object().keys({
        day: Joi.string().required(),
        isHoliday: Joi.required(),
        slots: Joi.array().required(),
        timeGap: Joi.number().required(),
      })
    );
    let valid = validation(schema, requestBody, res);
    if (valid) {
      let inserArr = [];
      let user = verifyJwt(req, res);
      requestBody?.map((value) => {
        let obj = {
          user_id: user?.user_id,
          day: value?.day,
          isHoliday: value?.isHoliday,
          slots: value?.slots,
          timeGap: Number(value?.timeGap),
        };
        inserArr?.push(obj);
      });

      SlotSchema.deleteMany({ user_id: user.user_id }).then(() => {
        SlotSchema.insertMany(inserArr)
          .then(function () {
            let response = {
              status: 200,
              message: "Slots has been updated.",
              data: inserArr,
            };
            res.status(200).send(response);
          })
          .catch(function () {
            let response = {
              status: 500,
              message: "Something went wrong!!",
              data: [],
            };
            res.status(500).send(response);
          });
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

const getSlotByAppointee = (req, res) => {
  try {
    const requestBody = req.body;
    const schema = Joi.object().keys({
      user_id: Joi.required(),
    });
    let valid = validation(schema, requestBody, res);
    if (valid) {
      SlotSchema.find({ user_id: requestBody?.user_id }, function (err, data) {
        let response = {
          status: 200,
          message: "Slots found",
          data: data,
        };
        res.status(200).send(response);
      }).select("day isHoliday slots timeGap");
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

const getSlotByUserId = (req, res) => {
  try {
    let user = verifyJwt(req, res);
    SlotSchema.find({ user_id: user?.user_id }, function (err, data) {
      let response = {
        status: 200,
        message: "Slots found",
        data: data,
      };
      res.status(200).send(response);
    }).select("day isHoliday slots timeGap");
  } catch (err) {
    let response = {
      status: 500,
      message: "Something went wrong!!",
      data: [],
    };
    res.status(500).send(response);
  }
};

module.exports = { addUpdate, getSlotByAppointee, getSlotByUserId };
