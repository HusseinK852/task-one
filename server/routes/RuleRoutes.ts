import express from "express";
import {
  getAllRules,
  createNewRule,
  getRuleById,
  updateRuleById,
  deleteRuleById,
  validateRuleData,
  addExistingRuleNode,
} from "../controllers/RuleController";

const router = express.Router();

router.route("/").get(getAllRules).post(createNewRule);

router
  .route("/:id")
  .get(getRuleById)
  .put(updateRuleById)
  .delete(deleteRuleById);

router.post("/validate", validateRuleData);

router.post("/:ruleId/nodes/:nodeId", addExistingRuleNode);

export default router;
