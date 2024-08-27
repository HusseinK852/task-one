import express from "express";
import {
    getAllActions,
    createNewAction,
    getActionById,
    updateActionById,
    deleteActionById

} from "../controllers/ActionController";

const router = express.Router();

router.route("/")
  .get(getAllActions)
  .post(createNewAction);

router.route("/:id")
  .get(getActionById)
  .put(updateActionById)
  .delete(deleteActionById);

export default router;
