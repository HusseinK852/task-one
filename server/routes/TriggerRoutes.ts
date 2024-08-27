import express from "express";
import {
    getAllTriggers,
    createNewTrigger,
    getTriggerById,
    updateTriggerById,
    deleteTriggerById
} from "../controllers/TriggerController";

const router = express.Router();

router.route("/")
  .get(getAllTriggers)
  .post(createNewTrigger);

router.route("/:id")
  .get(getTriggerById)
  .put(updateTriggerById)
  .delete(deleteTriggerById);

export default router;
