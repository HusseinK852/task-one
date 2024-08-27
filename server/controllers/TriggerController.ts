import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { TriggerModel, TriggerSchemaJoi } from "../models/TriggerModel";

const validateTrigger = (req: Request, res: Response, next: NextFunction) => {
  const { error } = TriggerSchemaJoi.validate(req.body, { abortEarly: false });
  if (error) {
    return next(new AppError(error.details.map(detail => detail.message).join(", "), 400));
  }
  next();
};

export const getAllTriggers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const triggers = await TriggerModel.find();
    res.status(200).json({
      status: "success",
      results: triggers.length,
      data: triggers,
    });
  }
);

export const createNewTrigger = [
  validateTrigger,
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newTrigger = await TriggerModel.create(req.body);
    res.status(201).json({
      status: "success",
      data: newTrigger,
    });
  })
];

export const getTriggerById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const trigger = await TriggerModel.findById(req.params.id);
    if (!trigger) {
      return next(new AppError("No trigger found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: trigger,
    });
  }
);

export const updateTriggerById = [
  validateTrigger,
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    delete req.body.createdAt;

    const updatedTrigger = await TriggerModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTrigger) {
      return next(new AppError("No trigger found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: updatedTrigger,
    });
  })
];

export const deleteTriggerById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deletedTrigger = await TriggerModel.findByIdAndDelete(req.params.id);
    if (!deletedTrigger) {
      return next(new AppError("No trigger found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
