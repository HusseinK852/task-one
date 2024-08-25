import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import Rule from "../models/RuleModel";

export const getAllRules = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rules = await Rule.find();
    res.status(200).json({
      status: "success",
      results: rules.length,
      data: rules,
    });
  }
);

export const createNewRule = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newRule = new Rule(req.body);
    await newRule.save();
    res.status(201).json({
      status: "success",
      data: newRule,
    });
  }
);

export const getRuleById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rule = await Rule.findOne({ id: req.params.id });
    if (!rule) {
      return next(new AppError("No rule found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: rule,
    });
  }
);

export const updateRuleById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rule = await Rule.findOneAndUpdate({ id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!rule) {
      return next(new AppError("No rule found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: rule,
    });
  }
);

export const deleteRuleById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rule = await Rule.findOneAndDelete({ id: req.params.id });
    if (!rule) {
      return next(new AppError("No rule found with that ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export const validateRule = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // const { id } = req.body;

    // const existingRule = await Rule.findOne({ id });

    // if (existingRule) {
    //   return res.status(400).json({
    //     status: "fail",
    //     message: `A rule with ID ${id} already exists.`,
    //   });
    // }

    const rule = new Rule(req.body);
    await rule.validate();

    res.status(200).json({
      status: "success",
      data: rule,
    });
  }
);

export const addConditionToRule = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { condition } = req.body;

    const rule = await Rule.findOne({ id });

    if (!rule) {
      return next(new AppError("No rule found with that ID", 404));
    }

    rule.conditions.push(condition);

    await rule.save();

    res.status(200).json({
      status: "success",
      data: rule,
    });
  }
);

export const addActionToRule = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { action } = req.body;

    const rule = await Rule.findOne({ id });

    if (!rule) {
      return next(new AppError("No rule found with that ID", 404));
    }

    rule.actions.push(action);

    await rule.save();

    res.status(200).json({
      status: "success",
      data: rule,
    });
  }
);