import { Request, Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import Role from "../models/RoleModel";

export const getAllRoles = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const roles = await Role.find();
    res.status(200).json({
      status: "success",
      results: roles.length,
      data: roles,
    });
  }
);

export const createNewRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newRole = await Role.create(req.body);
    res.status(201).json({
      status: "success",
      data: newRole,
    });
  }
);

export const getRoleById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const role = await Role.findOne({ id: req.params.id });
    if (!role) {
      return next(new AppError("No role found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: role,
    });
  }
);

export const updateRoleById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const role = await Role.findOneAndUpdate({ id: req.params.id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!role) {
      return next(new AppError("No role found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: role,
    });
  }
);

export const deleteRoleById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const role = await Role.findOneAndDelete({ id: req.params.id });
    if (!role) {
      return next(new AppError("No role found with that ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export const validateRule = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body;

    const existingRule = await Role.findOne({ id });

    if (existingRule) {
      return res.status(400).json({
        status: "fail",
        message: `A rule with ID ${id} already exists.`,
      });
    }

    const role = new Role(req.body);
    await role.validate();

    res.status(200).json({
      status: "success",
      data: role,
    });
  }
);
