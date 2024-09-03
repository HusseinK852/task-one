import mongoose, { Schema, Document } from "mongoose";
import Joi, { ValidationError } from "joi";
import type { Rule } from "../types/rules";
import { RuleNodeSchema, RuleNodeJoiSchema } from "./RuleNodeModel";

const RuleSchema = new Schema<Rule>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  nodes: [
    {
      type: RuleNodeSchema,
      required: true,
    },
  ],
  connections: [
    {
      fromIndex: { type: Number, required: true },
      toIndex: { type: Number, required: true },
      type: { type: String, required: true },
    },
  ],
  enabled: {
    type: Boolean,
    default: false,
  },
});

RuleSchema.pre("save", async function (next) {
  const rule = this as Document & Rule;

  await rule.populate("nodes");

  next();
});

const ruleSchemaJoi = Joi.object({
  name: Joi.string().required().messages({
    "string.base": `"name" should be a type of 'text'`,
    "string.empty": `"name" cannot be an empty field`,
    "any.required": `"name" is a required field`,
  }),
  description: Joi.string().required().messages({
    "string.base": `"description" should be a type of 'text'`,
    "string.empty": `"description" cannot be an empty field`,
    "any.required": `"description" is a required field`,
  }),
  nodes: Joi.array().items(RuleNodeJoiSchema).required().messages({
    "array.base": `"nodes" should be an array`,
    "any.required": `"nodes" is a required field`,
  }),
  connections: Joi.array()
    .items(
      Joi.object({
        fromIndex: Joi.number().required(),
        toIndex: Joi.number().required(),
        type: Joi.string().required(),
      })
    )
    .required()
    .messages({
      "array.base": `"connections" should be an array`,
      "any.required": `"connections" is a required field`,
    }),
  enabled: Joi.boolean().default(false).messages({
    "boolean.base": `"enabled" should be a type of 'boolean'`,
  }),
});

const validateRule = (ruleData: Partial<Rule>) => {
  return ruleSchemaJoi.validate(ruleData, { abortEarly: false });
};

const validateRuleMiddleware = (req: any, res: any, next: () => void) => {
  const { error }: { error?: ValidationError } = validateRule(req.body);
  if (error) {
    return res
      .status(400)
      .json({ error: error.details.map((detail) => detail.message) });
  }
  next();
};

const RuleModel = mongoose.model<Rule>("Rule", RuleSchema);

export { ruleSchemaJoi, validateRuleMiddleware, RuleModel };
