import mongoose, { Document, Schema } from "mongoose";
import Joi, { ValidationError } from "joi";
import type { Rule, Condition, Action } from "../types/rules";

const conditionSchemaJoi = Joi.object({
  field: Joi.string().required(),
  operator: Joi.string()
    .valid(
      "equals",
      "greater_than",
      "less_than",
      "not_equals",
      "greater_or_equal",
      "less_or_equal"
    )
    .required(),
  value: Joi.alternatives()
    .try(Joi.string(), Joi.number(), Joi.boolean())
    .required(),
});

const actionSchemaJoi = Joi.object({
  type: Joi.string().required(),
  algorithm: Joi.string().optional(),
  key_size: Joi.number().optional(),
});

const ruleSchemaJoi = Joi.object({
  id: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  conditions: Joi.array().items(conditionSchemaJoi).required(),
  actions: Joi.array().items(actionSchemaJoi).required(),
  priority: Joi.number().required(),
  enabled: Joi.boolean().required(),
});

const ConditionSchema = new Schema<Condition>({
  field: {
    type: String,
    required: true,
  },
  operator: {
    type: String,
    required: true,
    enum: [
      "equals",
      "greater_than",
      "less_than",
      "not_equals",
      "greater_or_equal",
      "less_or_equal",
    ],
  },
  value: {
    type: Schema.Types.Mixed,
    required: true,
  },
});

const ActionSchema = new Schema<Action>({
  type: {
    type: String,
    required: true,
  },
  algorithm: {
    type: String,
  },
  key_size: {
    type: Number,
  },
});

const RuleSchema = new Schema<Rule>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  conditions: [ConditionSchema],
  actions: [ActionSchema],
  priority: {
    type: Number,
    required: true,
  },
  enabled: {
    type: Boolean,
    required: true,
  },
});

const validateRule = (ruleData: Partial<Rule>) => {
  return ruleSchemaJoi.validate(ruleData, { abortEarly: false });
};

export const validateRuleMiddleware = (
  req: any,
  res: any,
  next: () => void
) => {
  const { error }: { error?: ValidationError } = validateRule(req.body);
  if (error) {
    return res
      .status(400)
      .json({ error: error.details.map((detail) => detail.message) });
  }
  next();
};

export default mongoose.model<Rule>("Rule", RuleSchema);
