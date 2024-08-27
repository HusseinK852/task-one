import express from "express";
import {
  getAllRules,
  createNewRule,
  getRuleById,
  updateRuleById,
  deleteRuleById,
  validateRuleData,
  addItemToRule,
  removeItemFromRule
} from "../controllers/RuleController";

const router = express.Router();

router.route("/")
  .get(getAllRules)
  .post(createNewRule);

router.route("/:id")
  .get(getRuleById)
  .put(updateRuleById)
  .delete(deleteRuleById);

router.post("/validate", validateRuleData);

router.post("/:id/:field/add", addItemToRule);

router.post("/:id/:field/remove", removeItemFromRule);

export default router;
