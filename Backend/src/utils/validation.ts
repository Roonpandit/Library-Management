import Joi from "joi";

export interface ValidationResult<T> {
  valid: boolean;
  data?: T;
  errors?: { field: string; message: string }[];
}

export const bookSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required",
    "any.required": "Title is required",
  }),
  author: Joi.string().required().messages({
    "string.empty": "Author is required",
    "any.required": "Author is required",
  }),
  ISBN: Joi.string()
    .pattern(/^(?:\d{10}|\d{13})$/)
    .required()
    .messages({
      "string.empty": "ISBN is required",
      "string.pattern.base": "ISBN must be either 10 or 13 digits",
      "any.required": "ISBN is required",
    }),
  publishedDate: Joi.date().max("now").iso().required().messages({
    "date.max": "Published date cannot be in the future",
    "any.required": "Published date is required",
  }),
  genre: Joi.string().required().messages({
    "string.empty": "Genre is required",
    "any.required": "Genre is required",
  }),
  copiesAvailable: Joi.number().min(0).required().messages({
    "number.min": "Copies available cannot be negative",
    "any.required": "Copies available is required",
  }),
  chargePerDay: Joi.number().min(0).required().messages({
    "number.min": "Charge per day cannot be negative",
    "any.required": "Charge per day is required",
  }),
  description: Joi.string().optional(),
  imageUrl: Joi.string().optional(),
}).custom((value, helpers) => {
  if (value.genre === "Academic" && value.copiesAvailable < 5) {
    return helpers.error("custom.academicCopies", {
      message: "Academic books must have at least 5 copies available",
    });
  }
  return value;
});

export const userSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
  role: Joi.string().valid("user", "admin").default("user").messages({
    "any.only": "Role must be either user or admin",
  }),
});

export const borrowSchema = Joi.object({
  bookId: Joi.string().required().messages({
    "string.empty": "Book ID is required",
    "any.required": "Book ID is required",
  }),
  borrowedTill: Joi.date().min("now").iso().required().messages({
    "date.min": "Return date must be in the future",
    "any.required": "Return date is required",
  }),
});

export const billSchema = Joi.object({
  borrowId: Joi.string().required().messages({
    "string.empty": "Borrow ID is required",
    "any.required": "Borrow ID is required",
  }),
  lateFee: Joi.number().min(0).optional().messages({
    "number.min": "Late fee cannot be negative",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

export function validate<T>(
  data: any,
  schema: Joi.ObjectSchema
): ValidationResult<T> {
  const { error, value } = schema.validate(data, { abortEarly: false });

  if (error) {
    return {
      valid: false,
      errors: error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      })),
    };
  }

  return {
    valid: true,
    data: value as T,
  };
}
