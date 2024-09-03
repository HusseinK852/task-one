import mongoose, { Schema } from "mongoose";
import Joi from "joi";
import type { RuleNode } from "../types/rules";

const RuleNodeSchema = new Schema<RuleNode>({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  debugMode: {
    type: Boolean,
    required: true,
  },
  configurationVersion: {
    type: Number,
    required: true,
  },
  configuration: {
    type: Schema.Types.Mixed,
    required: true,
  },
  additionalInfo: {
    description: {
      type: String,
      default: "",
    },
    layoutX: {
      type: Number,
      required: true,
    },
    layoutY: {
      type: Number,
      required: true,
    },
  },
});

const RuleNodeJoiSchema = Joi.object({
  type: Joi.string().required(),
  name: Joi.string().required(),
  debugMode: Joi.boolean().required(),
  configurationVersion: Joi.number().required(),
  configuration: Joi.object().required(),
  additionalInfo: Joi.object({
    description: Joi.string().allow("").optional(),
    layoutX: Joi.number().required(),
    layoutY: Joi.number().required(),
  }).required(),
});

const RuleNodeModel = mongoose.model<RuleNode>("RuleNode", RuleNodeSchema);

export { RuleNodeModel, RuleNodeSchema, RuleNodeJoiSchema };
