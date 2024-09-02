import mongoose, { Schema, Document } from "mongoose";
import Joi from "joi";
import type { Action } from "../types/rules";

// Mongoose Schema for OnFailure
const OnFailureSchema = new Schema<Action>({
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
    default: "OnFailure"
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

// Joi Validation Schema for OnFailure
const OnFailureSchemaJoi = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "OnFailure name must be a string",
    "string.empty": "OnFailure name is required",
  }),
  description: Joi.string().optional().allow("").messages({
    "string.base": "Description must be a string",
  }),
  command: Joi.string().required().messages({
    "string.base": "Command must be a string",
    "string.empty": "Command is required",
  }),
  type: Joi.string().default("OnFailure"),
  createdAt: Joi.date().forbidden().default(() => new Date()),
  updatedAt: Joi.date().default(() => new Date()),
});

OnFailureSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

OnFailureSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

OnFailureSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

OnFailureSchema.pre('updateMany', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

const OnFailureModel = mongoose.model<Action>("OnFailure", OnFailureSchema);

export { OnFailureModel, OnFailureSchemaJoi };
