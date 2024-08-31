import express from "express";
import {
    getAllOnFailures,
    createNewOnFailure,
    getOnFailureById,
    updateOnFailureById,
    deleteOnFailureById
} from "../controllers/onFailureController";

const router = express.Router();

router.route("/")
  .get(getAllOnFailures)
  .post(createNewOnFailure);

router.route("/:id")
  .get(getOnFailureById)
  .put(updateOnFailureById)
  .delete(deleteOnFailureById);

export default router;
