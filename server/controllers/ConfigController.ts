import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import { ConfigModel, configSchemaJoi } from "../models/ConfigModel";

const validateConfig = (req: Request, res: Response, next: NextFunction) => {
  const { error } = configSchemaJoi.validate(req.body, { abortEarly: false });
  if (error) {
    return next(new AppError(error.details.map(detail => detail.message).join(", "), 400));
  }
  next();
};

export const getAllConfigs = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const configs = await ConfigModel.find();
    res.status(200).json({
      status: "success",
      results: configs.length,
      data: configs,
    });
  }
);

export const createNewConfig = [
  validateConfig,
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newConfig = await ConfigModel.create(req.body);
    res.status(201).json({
      status: "success",
      data: newConfig,
    });
  })
];

export const getConfigById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const config = await ConfigModel.findById(req.params.id);
    if (!config) {
      return next(new AppError("No config found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: config,
    });
  }
);

export const updateConfigById = [
  validateConfig,
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const updatedConfig = await ConfigModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedConfig) {
      return next(new AppError("No config found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: updatedConfig,
    });
  })
];

export const deleteConfigById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const deletedConfig = await ConfigModel.findByIdAndDelete(req.params.id);
    if (!deletedConfig) {
      return next(new AppError("No config found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);
