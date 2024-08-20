import express from "express";
import {
  getAllRoles,
  createNewRole,
  getRoleById,
  updateRoleById,
  deleteRoleById,
  validateRule,
} from "../controllers/RoleController";

const router = express.Router();

router.route("/").get(getAllRoles).post(createNewRole);

router
  .route("/:id")
  .get(getRoleById)
  .put(updateRoleById)
  .delete(deleteRoleById);

router.route("/validate").post(validateRule);
export default router;
