import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { conditionSchemaJoi, ConditionModel } from "../models/ConditionModel";

const validateCondition = (req: Request, res: Response, next: NextFunction) => {
  const { error } = conditionSchemaJoi.validate(req.body, { abortEarly: false });
  if (error) {
    return next(new AppError(error.details.map(detail => detail.message).join(", "), 400));
  }
  next();
};

export const getAllConditions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const conditions = await ConditionModel.find();
    res.status(200).json({
      status: "success",
      results: conditions.length,
      data: conditions,
    });
  }
);

export const createNewCondition = [
  validateCondition,
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newCondition = await ConditionModel.create(req.body);
    res.status(201).json({
      status: "success",
      data: newCondition,
    });
  })
];

export const getConditionById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const condition = await ConditionModel.findById(req.params.id);
    if (!condition) {
      return next(new AppError("No condition found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: condition,
    });
  }
);

export const updateConditionById = [
  validateCondition,
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    delete req.body.createdAt;

    const updatedCondition = await ConditionModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCondition) {
      return next(new AppError("No condition found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: updatedCondition,
    });
  })
];

export const deleteConditionById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deletedCondition = await ConditionModel.findByIdAndDelete(req.params.id);
    if (!deletedCondition) {
      return next(new AppError("No condition found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
