import mongoose, { Schema, Document } from "mongoose";
import Joi from "joi";
import type { Condition } from "../types/rules";

// Mongoose Schema for Condition
const ConditionSchema = new Schema<Condition>({
  description: {
    type: String,
  },
  expression: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "Condition",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Joi Validation Schema for Condition
const conditionSchemaJoi = Joi.object({
  description: Joi.string().optional().allow("").messages({
    "string.base": "Description must be a string",
  }),
  expression: Joi.string().required().messages({
    "string.base": "Expression must be a string",
    "string.empty": "Expression is required",
  }),
  type: Joi.string().default("Condition"),
  createdAt: Joi.date().forbidden().default(() => new Date()),
  updatedAt: Joi.date().default(() => new Date()),
});

ConditionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

ConditionSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

ConditionSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

ConditionSchema.pre('updateMany', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

const ConditionModel = mongoose.model<Condition>("Condition", ConditionSchema);

export { ConditionModel, conditionSchemaJoi };
