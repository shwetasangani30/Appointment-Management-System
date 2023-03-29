const express = require("express");
const {
  isAdmin,
  verifyRouteJwt,
  isAppointee,
  isAppointeeClient,
  isAdminClient,
  isClient,
  isAdminAppointee,
} = require("./verification");

const authController = require("./controllers/auth");
const appointeeController = require("./controllers/appointee");
const clientController = require("./controllers/client");
const packagesController = require("./controllers/packages");
const slotsController = require("./controllers/slots");
const appointmentController = require("./controllers/appoinments");
const supportController = require("./controllers/support");

const router = express.Router();

/* Common */
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.get("/getUser/:id", verifyRouteJwt, authController.getUserById);
router.post("/updateUser", verifyRouteJwt, authController.updateUser);
router.get("/dashboard", verifyRouteJwt, authController.dashboard);

/* Appointee */
router.post("/add/appointee", isAdmin, appointeeController.add);
router.get("/getAll/appointee", isAdminClient, appointeeController.getAll);
router.put("/update/appointee", isAdmin, appointeeController.update);
router.delete(
  "/delete/appointee/:id",
  isAdmin,
  appointeeController.deleteAppointee
);
router.post(
  "/updateStatus/appointee",
  isAdmin,
  appointeeController.updateStatus
);

/* Clients */
router.post("/add/client", isAdmin, clientController.add);
router.get("/getAll/client", isAdminAppointee, clientController.getAll);
router.put("/update/client", isAdmin, clientController.update);
router.delete("/delete/client/:id", isAdmin, clientController.deleteClient);
router.post("/updateStatus/client", isAdmin, clientController.updateStatus);
router.post("/block/client", isAdmin, clientController.blockClient);

/* Packages */
router.post("/add/package", isAppointee, packagesController.add);
router.get("/package/:id", isAppointee, packagesController.getPackageyId);
router.get(
  "/getAllByUser/package",
  isAppointee,
  packagesController.getAllByUser
);
router.get("/getAll/package", isAppointeeClient, packagesController.getAll);
router.put("/update/package", isAppointee, packagesController.update);
router.delete(
  "/delete/package/:id",
  isAppointee,
  packagesController.deletePackage
);
router.post(
  "/updateStatus/package",
  isAppointee,
  packagesController.updateStatus
);
router.get(
  "/getAllByUser/package",
  isAppointee,
  packagesController.getAllByUser
);
router.post(
  "/getByAppointee/package",
  isClient,
  packagesController.getByAppointee
);

/* Slots */
router.post("/addUpdate/slot", isAppointee, slotsController.addUpdate);
router.post(
  "/getSlotByAppointee/slot",
  isAppointeeClient,
  slotsController.getSlotByAppointee
);
router.get("/getbyUser/slot", isAppointee, slotsController.getSlotByUserId);

/* Appointments */
router.post("/add/appointment", isClient, appointmentController.add);
router.post("/update/appointment", isClient, appointmentController.update);
router.get(
  "/getAllByUser/appointment",
  isClient,
  appointmentController.getAllByUser
);
router.post(
  "/getByStatus/appointment",
  verifyRouteJwt,
  appointmentController.getByStatus
);
router.post(
  "/getPendingApprovedByDate/appointment",
  isAppointeeClient,
  appointmentController.getPendingApprovedByDate
);
router.post(
  "/updateStatus/appointment",
  isAppointeeClient,
  appointmentController.updateStatus
);
router.get(
  "/getAllByAppointee/appointment",
  isAppointee,
  appointmentController.getAllByAppointee
);
router.get(
  "/appointment/:id",
  isAppointeeClient,
  appointmentController.getById
);

/* Support */
router.post("/add/message", isAppointeeClient, supportController.add);
router.get("/getChats", isAppointeeClient, supportController.getChats);
router.post("/getMessages", isAppointeeClient, supportController.getMessages);

module.exports = router;
