import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { OnFailureModel, OnFailureSchemaJoi } from "../models/onFailureModel";

const validateOnFailure = (req: Request, res: Response, next: NextFunction) => {
  const { error } = OnFailureSchemaJoi.validate(req.body, { abortEarly: false });
  if (error) {
    return next(new AppError(error.details.map(detail => detail.message).join(", "), 400));
  }
  next();
};

export const getAllOnFailures = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const OnFailures = await OnFailureModel.find();
    res.status(200).json({
      status: "success",
      results: OnFailures.length,
      data: OnFailures,
    });
  }
);

export const createNewOnFailure = [
  validateOnFailure,
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newOnFailure = await OnFailureModel.create(req.body);
    res.status(201).json({
      status: "success",
      data: newOnFailure,
    });
  })
];

export const getOnFailureById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const OnFailure = await OnFailureModel.findById(req.params.id);
    if (!OnFailure) {
      return next(new AppError("No OnFailure found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: OnFailure,
    });
  }
);

export const updateOnFailureById = [
  validateOnFailure,
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    delete req.body.createdAt;

    const updatedOnFailure = await OnFailureModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedOnFailure) {
      return next(new AppError("No OnFailure found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: updatedOnFailure,
    });
  })
];

export const deleteOnFailureById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deletedOnFailure = await OnFailureModel.findByIdAndDelete(req.params.id);
    if (!deletedOnFailure) {
      return next(new AppError("No action found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
