import express from "express";
import {
    getAllConditions,
    createNewCondition,
    getConditionById,
    updateConditionById,
    deleteConditionById
} from "../controllers/ConditionController";

const router = express.Router();

router.route("/")
  .get(getAllConditions)
  .post(createNewCondition);

router.route("/:id")
  .get(getConditionById)
  .put(updateConditionById)
  .delete(deleteConditionById);

export default router;
