import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { RuleNodeModel } from "../models/RuleNodeModel";

export const getAllRuleNodes = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const ruleNodes = await RuleNodeModel.find({});
    res.status(200).json({
      success: true,
      data: ruleNodes,
    });
  }
);

export const createRuleNode = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newRuleNodes = await RuleNodeModel.create(req.body);
    res.status(201).json({
      success: true,
      data: newRuleNodes,
    });
  }
);

export const getRuleNodeById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const ruleNode = await RuleNodeModel.findById(req.params.id);
    if (!ruleNode) {
      return next(new AppError("No rule node found with that ID", 404));
    }
    res.status(200).json({
      success: true,
      data: ruleNode,
    });
  }
);
