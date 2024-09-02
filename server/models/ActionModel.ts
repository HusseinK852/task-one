import mongoose, { Schema, Document } from "mongoose";
import Joi from "joi";
import type { Action } from "../types/rules";

// Mongoose Schema for Action
const ActionSchema = new Schema<Action>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  command: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "Action",
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

// Joi Validation Schema for Action
const ActionSchemaJoi = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Action name must be a string",
    "string.empty": "Action name is required",
  }),
  description: Joi.string().optional().allow("").messages({
    "string.base": "Description must be a string",
  }),
  command: Joi.string().required().messages({
    "string.base": "Command must be a string",
    "string.empty": "Command is required",
  }),
  type: Joi.string().default("Action"),
  createdAt: Joi.date().forbidden().default(() => new Date()),
  updatedAt: Joi.date().default(() => new Date()),
});

ActionSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

ActionSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

ActionSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

ActionSchema.pre('updateMany', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

const ActionModel = mongoose.model<Action>("Action", ActionSchema);

export { ActionModel, ActionSchemaJoi };
