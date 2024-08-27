import mongoose, { Schema, Document } from "mongoose";
import Joi, { ValidationError } from "joi";
import type { Rule } from "../types/rules";

const RuleSchema = new Schema<Rule>({
  name: {
    type: String,
    required: true,
  },
  triggers: [{
    type: Schema.Types.ObjectId,
    ref: 'Trigger',
    required: true,
  }],
  conditions: [{
    type: Schema.Types.ObjectId,
    ref: 'Condition',
    required: true,
  }],
  actions: [{
    type: Schema.Types.ObjectId,
    ref: 'Action',
    required: true,
  }],
  onFailure: [{
    type: Schema.Types.ObjectId,
    ref: 'Action',
    required: true,
  }],
  config: [{
    type: Schema.Types.ObjectId,
    ref: 'Config',
    required: true,
  }],
  enabled: {
    type: Boolean,
    default: false,
  }
});

RuleSchema.pre('save', async function (next) {
  const rule = this as Document & Rule;

  await rule.populate('triggers conditions actions onFailure config');

  next();
});

const ruleSchemaJoi = Joi.object({
  name: Joi.string().required().messages({
    'string.base': `"name" should be a type of 'text'`,
    'string.empty': `"name" cannot be an empty field`,
    'any.required': `"name" is a required field`
  }),
  triggers: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).required().messages({
    'array.base': `"triggers" should be an array`,
    'any.required': `"triggers" is a required field`,
    'string.pattern.base': `"triggers" must contain valid ObjectId strings`
  }),
  conditions: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).required().messages({
    'array.base': `"conditions" should be an array`,
    'any.required': `"conditions" is a required field`,
    'string.pattern.base': `"conditions" must contain valid ObjectId strings`
  }),
  actions: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).required().messages({
    'array.base': `"actions" should be an array`,
    'any.required': `"actions" is a required field`,
    'string.pattern.base': `"actions" must contain valid ObjectId strings`
  }),
  onFailure: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).required().messages({
    'array.base': `"onFailure" should be an array`,
    'any.required': `"onFailure" is a required field`,
    'string.pattern.base': `"onFailure" must contain valid ObjectId strings`
  }),
  config: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).required().messages({
    'array.base': `"config" should be an array`,
    'any.required': `"config" is a required field`,
    'string.pattern.base': `"config" must contain valid ObjectId strings`
  })
});

const validateRule = (ruleData: Partial<Rule>) => {
  return ruleSchemaJoi.validate(ruleData, { abortEarly: false });
};

const validateRuleMiddleware = (
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

const RuleModel = mongoose.model<Rule>("Rule", RuleSchema);

export { ruleSchemaJoi, validateRuleMiddleware, RuleModel };
