import mongoose, { Schema } from "mongoose";
import Joi from "joi";
import type { Config } from "../types/rules";

const ConfigSchema = new Schema<Config>({
  key: {
    type: String,
    required: true,
  },
  value: {
    type: Schema.Types.Mixed,
    required: true,
  },
});

// Joi Validation Schema for Config
const configSchemaJoi = Joi.object({
  key: Joi.string().required(),
  value: Joi.any().required(),
});

const ConfigModel = mongoose.model<Config>("Config", ConfigSchema);
export { ConfigModel, configSchemaJoi };
