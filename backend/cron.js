const moment = require("moment/moment");
const { AppointmentSchema } = require("./models/appointmentModel");

const pendingToAutoCancel = () => {
  AppointmentSchema.find(
    { status: { $in: [0] }, appointmentDate: { $lte: new Date() } },
    function (err, appoinments) {
      if (appoinments?.length > 0) {
        let current = moment();
        appoinments?.map(async (appo) => {
          let date = moment()?.format("DD-MM-YYYY");
          let appoinmentDate = moment(appo?.appointmentDate)?.format(
            "DD-MM-YYYY"
          );
          if (
            (date === appoinmentDate &&
              current.isSameOrAfter(
                moment(appo?.appointmentTime?.split("-")[0], "HH:mm")
              )) ||
            date !== appoinmentDate
          ) {
            await AppointmentSchema.findOneAndUpdate(
              { _id: appo?.id },
              {
                status: 4,
                updatedAt: new Date(),
              }
            );
          }
        });
      }
    }
  );
};

module.exports = { pendingToAutoCancel };
