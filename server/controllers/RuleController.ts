import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import {
  validateRuleMiddleware,
  RuleModel,
  ruleSchemaJoi,
} from "../models/RuleModel";
import { RuleNodeModel } from "../models/RuleNodeModel";

const validateRule = validateRuleMiddleware;

export const getAllRules = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rules = await RuleModel.find();
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
  }),
];

export const getRuleById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rule = await RuleModel.findById(req.params.id);
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
  // validateRule,
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const updatedRule = await RuleModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedRule) {
      return next(new AppError("No rule found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: updatedRule,
    });
  }),
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
      return next(
        new AppError(
          `Validation failed: ${error.details
            .map((e) => e.message)
            .join(", ")}`,
          400
        )
      );
    }

    res.status(200).json({
      status: "success",
      message: "Rule is valid",
    });
  }
);

export const addExistingRuleNode = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ruleId, nodeId } = req.params;

    const rule = await RuleModel.findById(ruleId);

    if (!rule) {
      return next(new AppError("No rule found with that ID", 404));
    }

    const existingNode = await RuleNodeModel.findById(nodeId);

    if (!existingNode) {
      return next(new AppError("No node found with that ID", 404));
    }

    rule.nodes.push(existingNode);

    await rule.save();

    res.status(201).json({
      status: "success",
      data: existingNode,
    });
  }
);
