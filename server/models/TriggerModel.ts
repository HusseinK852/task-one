import mongoose, { Schema, Document } from "mongoose";
import Joi from "joi";
import type { Trigger } from "../types/rules";

interface TriggerDocument extends Trigger, Document {}

// Mongoose Schema for Trigger
const TriggerSchema = new Schema<TriggerDocument>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  eventType: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
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

// Joi Validation Schema for Trigger
const TriggerSchemaJoi = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Trigger name must be a string",
    "string.empty": "Trigger name is required",
  }),
  description: Joi.string().optional().allow("").messages({
    "string.base": "Description must be a string",
  }),
  eventType: Joi.string().required().messages({
    "string.base": "EventType must be a string",
    "string.empty": "EventType is required",
  }),
  isActive: Joi.boolean().default(true),
  createdAt: Joi.date().forbidden().default(() => new Date()),
  updatedAt: Joi.date().default(() => new Date()),
});

TriggerSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

TriggerSchema.pre('updateOne', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

TriggerSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

TriggerSchema.pre('updateMany', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

const TriggerModel = mongoose.model<TriggerDocument>("Trigger", TriggerSchema);

export { TriggerModel, TriggerSchemaJoi };
