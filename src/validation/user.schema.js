import Joi from "joi";

export const userSchema = {
  signup: Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
  login: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
