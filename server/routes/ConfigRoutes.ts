import express from "express";
import {
    getAllConfigs,
    createNewConfig,
    getConfigById,
    updateConfigById,
    deleteConfigById
} from "../controllers/ConfigController";

const router = express.Router();

router.route("/")
  .get(getAllConfigs)
  .post(createNewConfig);

router.route("/:id")
  .get(getConfigById)
  .put(updateConfigById)
  .delete(deleteConfigById);

export default router;
