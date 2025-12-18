import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(1).required(),
});

export const noteSchema = Joi.object({
  title: Joi.string().min(1).required(),
  content: Joi.string().allow(''), // Content can be empty
});