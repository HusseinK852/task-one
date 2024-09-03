import express from "express";
import {
  getAllRuleNodes,
  createRuleNode,
  getRuleNodeById,
} from "../controllers/RuleNodeController";

const router = express.Router();

router.route("/").get(getAllRuleNodes).post(createRuleNode);

router.route("/:id").get(getRuleNodeById);

export default router;
