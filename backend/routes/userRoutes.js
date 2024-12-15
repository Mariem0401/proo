const express = require("express");
const router = express.Router();
const {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser, 
} = require("../Controller/userController");
const { signup ,login , protectionMW, howCanDo} = require("../Controller/authController");

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/").post(protectionMW, createUser).get(protectionMW, getAllUsers);
router
  .route("/:id")
  .get(protectionMW, howCanDo("admin", "user"), getUserById)
  .patch(protectionMW, updateUser)
  .delete(protectionMW, howCanDo("admin"), deleteUser);
module.exports = router;