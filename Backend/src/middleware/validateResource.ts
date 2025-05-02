import { Request, Response, NextFunction } from "express";
import { Schema, ObjectSchema } from "joi";
import { validate } from "../utils/validation";

export const validateResource =
  (schema: ObjectSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const resource = req.body;
    const { valid, data, errors } = validate(resource, schema);

    if (!valid) {
      return res.status(400).json({ errors });
    }

    req.body = data;
    return next();
  };
