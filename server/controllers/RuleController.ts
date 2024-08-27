import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { validateRuleMiddleware, RuleModel, ruleSchemaJoi } from "../models/RuleModel";

const validateRule = validateRuleMiddleware;

type RuleField = "triggers" | "conditions" | "actions" | "onFailure" | "config";

export const getAllRules = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rules = await RuleModel.find().populate('triggers conditions actions onFailure config');
    res.status(200).json({
      status: "success",
      results: rules.length,
      data: rules,
    });
  }
);

export const createNewRule = [
  validateRule,
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newRule = await RuleModel.create(req.body);
    res.status(201).json({
      status: "success",
      data: newRule,
    });
  })
];

export const getRuleById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rule = await RuleModel.findById(req.params.id).populate('triggers conditions actions onFailure config');
    if (!rule) {
      return next(new AppError("No rule found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: rule,
    });
  }
);

export const updateRuleById = [
  validateRule,
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const updatedRule = await RuleModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('triggers conditions actions onFailure config');

    if (!updatedRule) {
      return next(new AppError("No rule found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: updatedRule,
    });
  })
];

export const deleteRuleById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deletedRule = await RuleModel.findByIdAndDelete(req.params.id);
    if (!deletedRule) {
      return next(new AppError("No rule found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export const validateRuleData = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const ruleData = req.body;
    
    const { error } = ruleSchemaJoi.validate(ruleData, { abortEarly: false });
    
    if (error) {
      return next(new AppError(`Validation failed: ${error.details.map(e => e.message).join(", ")}`, 400));
    }

    res.status(200).json({
      status: "success",
      message: "Rule is valid",
    });
  }
);

const modifyArrayField = (operation: 'add' | 'remove') => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const rule = await RuleModel.findById(req.params.id).populate('triggers conditions actions onFailure config');
    if (!rule) {
      return next(new AppError("No rule found with that ID", 404));
    }

    const field = req.params.field as RuleField;
    const itemId = req.body.itemId;

    if (!rule[field]) {
      return next(new AppError(`Field ${field} not found in the rule`, 400));
    }

    if (operation === 'add') {
      (rule[field] as mongoose.Types.Array<any>).push(itemId);
    } else if (operation === 'remove') {
      (rule[field] as mongoose.Types.Array<any>).pull(itemId);
    } else {
      return next(new AppError("Invalid operation", 400));
    }

    await rule.save();
    res.status(200).json({
      status: "success",
      data: rule,
    });
  });
};

export const addItemToRule = modifyArrayField('add');
export const removeItemFromRule = modifyArrayField('remove');
