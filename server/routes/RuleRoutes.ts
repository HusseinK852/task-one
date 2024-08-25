import express from "express";
import {
  getAllRules,
  createNewRule,
  getRuleById,
  updateRuleById,
  deleteRuleById,
  validateRule,
  addConditionToRule,
  addActionToRule,
} from "../controllers/RuleController";

const router = express.Router();

router.route("/").get(getAllRules).post(createNewRule);

router
  .route("/:id")
  .get(getRuleById)
  .put(updateRuleById)
  .delete(deleteRuleById);

router.route("/validate").post(validateRule);

router.route("/:id/add-condition").post(addConditionToRule);
router.route("/:id/add-action").post(addActionToRule);

export default router;
