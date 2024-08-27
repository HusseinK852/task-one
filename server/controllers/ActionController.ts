import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { ActionModel, ActionSchemaJoi } from "../models/ActionModel";

const validateAction = (req: Request, res: Response, next: NextFunction) => {
  const { error } = ActionSchemaJoi.validate(req.body, { abortEarly: false });
  if (error) {
    return next(new AppError(error.details.map(detail => detail.message).join(", "), 400));
  }
  next();
};

export const getAllActions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const actions = await ActionModel.find();
    res.status(200).json({
      status: "success",
      results: actions.length,
      data: actions,
    });
  }
);

export const createNewAction = [
  validateAction,
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newAction = await ActionModel.create(req.body);
    res.status(201).json({
      status: "success",
      data: newAction,
    });
  })
];

export const getActionById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const action = await ActionModel.findById(req.params.id);
    if (!action) {
      return next(new AppError("No action found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: action,
    });
  }
);

export const updateActionById = [
  validateAction,
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    delete req.body.createdAt;

    const updatedAction = await ActionModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAction) {
      return next(new AppError("No action found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: updatedAction,
    });
  })
];

export const deleteActionById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deletedAction = await ActionModel.findByIdAndDelete(req.params.id);
    if (!deletedAction) {
      return next(new AppError("No action found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
